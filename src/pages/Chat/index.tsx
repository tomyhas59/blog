// src/pages/Chat/index.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { RootState } from "../../reducer";
import { MessageType } from "../../types";
import useOutsideClick from "../../hooks/useOutsideClick";
import ChatRoom from "../../components/chat/ChatRoom";
import * as S from "./ChatStyles";
import FriendList from "./FriendList";
import RoomList from "./RoomList";

export interface UserRoomList {
  id: number;
  User1: { id: number; nickname: string };
  User2: { id: number; nickname: string };
  User1Join: boolean;
  User2Join: boolean;
  UnReadMessages: MessageType[];
}

const Chat = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState<UserRoomList | null>(null);
  const [activeUserOption, setActiveUserOption] = useState<string | null>(null);
  const [userRoomList, setUserRoomList] = useState<UserRoomList[]>([]);
  const [room, setRoom] = useState<UserRoomList | null>(null);
  const [activeTab, setActiveTab] = useState<"friends" | "rooms">("rooms");
  const socket = useRef<Socket | null>(null);
  const userOptionRef = useRef<HTMLDivElement>(null);

  // Socket 초기화
  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    if (me) {
      socket.current.emit("loginUser", { id: me.id, nickname: me.nickname });
    }
    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  // 데이터 페칭 로직
  const fetchUserChatRooms = useCallback(async () => {
    if (!me) return;
    try {
      const response = await axios.get(`/post/findChat?userId=${me.id}`);
      setUserRoomList(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [me]);

  useEffect(() => {
    fetchUserChatRooms();
    socket.current?.on("updateUserRoomList", fetchUserChatRooms);
    return () => {
      socket.current?.off("updateUserRoomList");
    };
  }, [fetchUserChatRooms]);

  // 소켓 이벤트 리스너
  useEffect(() => {
    socket.current?.on("newRoom", (newRoom: UserRoomList) => {
      setUserRoomList((prev) =>
        prev.find((r) => r.id === newRoom.id) ? prev : [...prev, newRoom],
      );
    });
    socket.current?.on("unReadMessages", ({ unReadMessages, roomId }) => {
      if (roomId !== undefined) {
        setUserRoomList((prev) =>
          prev.map((r) =>
            r.id === roomId ? { ...r, UnReadMessages: unReadMessages } : r,
          ),
        );
      }
    });
    return () => {
      socket.current?.off("newRoom");
      socket.current?.off("unReadMessages");
    };
  }, []);

  const handleChatStart = useCallback(
    async (user: { id: number; nickname: string }) => {
      if (!me || user.id === me.id) return;
      try {
        const response = await axios.post("/post/chatRoom", {
          user2Id: user.id,
        });
        const chatRoom = response.data;
        if (chatRoom) {
          setRoom(chatRoom);
          setActiveRoom(chatRoom);
          setSelectedUserId(user.id);
          if (!userRoomList.some((r) => r.id === chatRoom.id)) {
            socket.current?.emit("createRoom", chatRoom.id, me);
          }
          setActiveUserOption(null);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [me, userRoomList],
  );

  useOutsideClick([userOptionRef], () => setActiveUserOption(null));

  const renderRoom = () => {
    if (activeRoom === room && room?.id) {
      return (
        <ChatRoom
          me={me}
          room={room}
          selectedUserId={selectedUserId}
          setActiveRoom={setActiveRoom}
          setUserRoomList={setUserRoomList}
        />
      );
    }
    return (
      <S.EmptyState>
        <S.EmptyIcon>
          <i className="far fa-comments"></i>
        </S.EmptyIcon>
        <S.EmptyText>
          {userRoomList.length < 1
            ? "친구와 채팅을 시작해보세요"
            : "채팅방을 선택하세요"}
        </S.EmptyText>
      </S.EmptyState>
    );
  };

  const mutualUsers = (me?.Followers || []).filter((f) =>
    (me?.Followings || []).some((following) => following.id === f.id),
  );

  return (
    <S.ChatContainer>
      <S.Sidebar>
        <S.TabButtons>
          <S.TabButton
            active={activeTab === "rooms"}
            onClick={() => setActiveTab("rooms")}
          >
            <i className="fas fa-comments"></i>
            <span>채팅</span>
            {userRoomList.length > 0 && (
              <S.TabBadge>{userRoomList.length}</S.TabBadge>
            )}
          </S.TabButton>
          <S.TabButton
            active={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}
          >
            <i className="fas fa-user-friends"></i>
            <span>친구</span>
            {mutualUsers.length > 0 && (
              <S.TabBadge>{mutualUsers.length}</S.TabBadge>
            )}
          </S.TabButton>
        </S.TabButtons>

        <S.TabContent>
          {activeTab === "rooms" ? (
            <RoomList
              meId={me?.id}
              userRoomList={userRoomList}
              setRoom={setRoom}
              setActiveRoom={setActiveRoom}
              setSelectedUserId={setSelectedUserId}
            />
          ) : (
            <FriendList
              meId={me?.id}
              mutualUsers={mutualUsers}
              activeUserOption={activeUserOption}
              handleUserOptionClick={(nick) =>
                setActiveUserOption((prev) => (prev === nick ? null : nick))
              }
              handleChatStart={handleChatStart}
              userOptionRef={userOptionRef}
              setActiveUserOption={setActiveUserOption}
            />
          )}
        </S.TabContent>
      </S.Sidebar>

      <S.ChatContent>{renderRoom()}</S.ChatContent>
    </S.ChatContainer>
  );
};

export default Chat;
