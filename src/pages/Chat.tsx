import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import { RootState } from "../reducer";
import { Message } from "../types";
import useOutsideClick from "../hooks/useOutsideClick";
import axios from "axios";
import OneOnOneChatRoom from "../components/chat/OneOnOneChatRoom";
import FollowButton from "../components/FollowButton";

export interface UserRoomList {
  id: number;
  User1: { id: number; nickname: string };
  User2: { id: number; nickname: string };
  User1Join: boolean;
  User2Join: boolean;
  UnReadMessages: Message[];
}

const Chat = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState<UserRoomList | null>(null);
  const [activeUserOption, setActiveUserOption] = useState<string | null>(null);
  const [userRoomList, setUserRoomList] = useState<UserRoomList[]>([]);
  const [room, setRoom] = useState<UserRoomList | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    if (me) {
      const userInfo = { id: me.id, nickname: me.nickname };
      socket.current.emit("loginUser", userInfo);
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  useEffect(() => {
    const fetchUserChatRooms = async () => {
      try {
        const response = await axios.get(`/post/findChat?userId=${me?.id}`);
        setUserRoomList(response.data);
      } catch (error) {
        console.error("Error fetching user chat rooms:", error);
      }
    };
    if (me) {
      fetchUserChatRooms();
    }

    socket.current?.on("updateUserRoomList", () => {
      fetchUserChatRooms();
    });

    return () => {
      socket.current?.off("updateUserRoomList");
    };
  }, [me]);

  const createOneOnOneChatRoom = async (user2Id: number) => {
    try {
      const response = await axios.post("/post/chatRoom", { user2Id });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating 1:1 chat room:", error);
      throw error;
    }
  };

  const onUserOptionClick = useCallback((nickname: string) => {
    setActiveUserOption((prev) => (prev === nickname ? null : nickname));
  }, []);

  const userOptoinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.current?.on("newRoom", (newRoom: UserRoomList) => {
      setUserRoomList((prev) => {
        const roomExists = prev.find((room) => room.id === newRoom.id);
        if (!roomExists) {
          return [...prev, newRoom];
        }
        return prev;
      });
    });

    socket.current?.on("unReadMessages", ({ unReadMessages, roomId }) => {
      if (roomId !== undefined) {
        setUserRoomList((prev) =>
          prev.map((room) =>
            room.id === roomId
              ? { ...room, UnReadMessages: unReadMessages }
              : room
          )
        );
      }
    });

    return () => {
      socket.current?.off("newRoom");
      socket.current?.off("unReadMessages");
    };
  }, []);

  const onUserClick = useCallback(
    async (user: { id: number; nickname: string }) => {
      try {
        if (me && user.id !== me.id) {
          const chatRoom = await createOneOnOneChatRoom(user.id);
          console.log(chatRoom);
          if (chatRoom) {
            setRoom(chatRoom);
            setActiveRoom(chatRoom);
            setSelectedUserId(user.id);
            if (!userRoomList.some((room) => room.id === chatRoom.id)) {
              socket.current?.emit("createRoom", chatRoom.id, me);
            }
            setActiveUserOption(null);
          }
        }
      } catch (error) {
        console.error("Error creating 1:1 chat room:", error);
      }
    },
    [me, userRoomList]
  );

  useOutsideClick([userOptoinRef], () => {
    setActiveUserOption(null);
  });

  const renderRoom = () => {
    if (activeRoom === room && room?.id) {
      return (
        <OneOnOneChatRoom
          me={me}
          room={room}
          selectedUserId={selectedUserId}
          setActiveRoom={setActiveRoom}
          setUserRoomList={setUserRoomList}
        />
      );
    } else {
      return (
        <ChatPlaceholder>
          <div>
            1:1 채팅방을
            {userRoomList?.length < 1 ? " 만들어 보세요" : " 선택하세요"}
          </div>
        </ChatPlaceholder>
      );
    }
  };

  const followers = me?.Followers || [];
  const followings = me?.Followings || [];

  const mutualUsers = followers.filter((follower) =>
    followings.some((following) => following.id === follower.id)
  );

  return (
    <ChatContainer>
      <ListContainer>
        <FollowList>
          <h1>친구 목록</h1>
          <ul>
            {mutualUsers.map((user) => (
              <li key={user.id}>
                <button onClick={() => onUserOptionClick(user.nickname)}>
                  {user.nickname.slice(0, 5)}
                </button>
                {user.id !== me?.id && activeUserOption === user.nickname && (
                  <UserOption ref={userOptoinRef}>
                    <button
                      onClick={() => {
                        onUserClick(user);
                      }}
                    >
                      1:1 채팅하기
                    </button>
                    <FollowButton
                      userId={user.id}
                      setActiveUserOption={setActiveUserOption}
                    />
                  </UserOption>
                )}
              </li>
            ))}
          </ul>
        </FollowList>
        <RoomList>
          <h1>채팅방 목록</h1>
          {userRoomList.map((userRoom) => {
            const currentUserId = me?.id;
            const seletedUserId =
              userRoom.User1.id === currentUserId
                ? userRoom.User2.id
                : userRoom.User1.id;
            const count: number = Array.isArray(userRoom.UnReadMessages)
              ? userRoom.UnReadMessages.filter(
                  (unReadMessage) => unReadMessage.UserId !== currentUserId
                ).length
              : 0;
            return (
              <RoomItem
                key={userRoom.id}
                onClick={() => {
                  setSelectedUserId(seletedUserId);
                  setRoom(userRoom);
                  setActiveRoom(userRoom);
                }}
              >
                <UnReadMessageCount count={count}>{count}</UnReadMessageCount>
                {userRoom.User1.id === me?.id
                  ? userRoom.User2.nickname
                  : userRoom.User1.nickname}
                님과 채팅
              </RoomItem>
            );
          })}
        </RoomList>
      </ListContainer>
      <ContentWrapper>{renderRoom()}</ContentWrapper>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 50px;
  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 40px;
  align-items: flex-start;
  padding: 10px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 480px) {
    width: 50%;
    gap: 20px;
  }
`;

const FollowList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  > h1 {
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    > li {
      font-size: 18px;
      color: #333;
      position: relative;
      &:hover {
        color: ${(props) => props.theme.mainColor};
        cursor: pointer;
      }
      > button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 10px;
      }
    }
  }
  @media (max-width: 480px) {
    width: 100%;
    ul {
      display: flex;
      > li {
        margin-left: 5px;
      }
    }
  }
`;

const RoomList = styled.ul`
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  > h1 {
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  @media (max-width: 480px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
`;

const RoomItem = styled.li`
  position: relative;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  color: #fff;
  list-style: none;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

interface MyComponentProps {
  count: number;
}

const UnReadMessageCount = styled.div<MyComponentProps>`
  position: absolute;
  background-color: red;
  color: #fff;
  right: -10px;
  top: -5px;
  width: ${(props) => `${8 + props.count.toString().length * 12}px`};
  height: 20px;
  border-radius: 50%;
  display: ${(props) => (props.count === 0 ? "none" : "flex")};
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 500px;
  @media (max-width: 480px) {
    margin-left: 0;
    position: absolute;
    width: 100%;
  }
`;

const UserOption = styled.div`
  position: absolute;
  z-index: 999;
  top: 20px;
  left: 20px;
  width: 80px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #fff;
  & button {
    margin: 5px 0;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
  @media (max-width: 480px) {
    z-index: 999;
    width: 70px;
    top: 30px;
    left: 40px;
    padding: 2px;
    & button {
      font-size: 10px;
    }
  }
`;

const ChatPlaceholder = styled.div`
  color: #aaa;
  height: 200px;
  line-height: 200px;
  font-size: 24px;
  @media (max-width: 480px) {
    display: none;
  }
`;
