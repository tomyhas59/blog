import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "../../reducer";
import { MessageType, UserType } from "../../types";
import { useDispatch } from "react-redux";
import { READ_CHAT_REQUEST } from "../../reducer/post";
import styled from "styled-components";
import { UserRoomList } from "../../pages/Chat";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

interface ChatRoomProps {
  me: UserType | null;
  selectedUserId: number | null;
  room: UserRoomList | null;
  setActiveRoom: (room: UserRoomList | null) => void;
  setUserRoomList: React.Dispatch<React.SetStateAction<UserRoomList[]>>;
}

const ChatRoom = ({
  me,
  room,
  selectedUserId,
  setActiveRoom,
  setUserRoomList,
}: ChatRoomProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { chatMessages } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const currentRoomId = room?.id;
  const socket = useRef<Socket | null>(null);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);

  const [chatDisable, setChatDisable] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  // 소켓 초기화 및 청소
  useEffect(() => {
    socket.current = io(
      process.env.NODE_ENV === "production"
        ? "https://patient-marina-tomyhas59-8c3582f9.koyeb.app"
        : "http://localhost:3075"
    );

    return () => {
      //페이지 떠날 시
      if (currentRoomId && me) {
        socket.current?.emit("leaveRoom", currentRoomId, me);
      }
      socket.current?.disconnect();
    };
  }, [currentRoomId, me]);

  // 채팅 메시지 초기화
  useEffect(() => {
    if (currentRoomId) {
      dispatch({
        type: READ_CHAT_REQUEST,
        data: currentRoomId,
      });
    }
  }, [dispatch, currentRoomId]);

  // 채팅 방 상태 확인
  useEffect(() => {
    if (!room?.User1Join || !room.User2Join) setChatDisable(true);
  }, [room]);

  // 소켓 이벤트 리스너
  useEffect(() => {
    socket.current?.emit("joinRoom", currentRoomId, me);

    socket.current?.on("receiveMessage", (message) => {
      if (message.ChatRoomId === currentRoomId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.current?.on("systemMessage", (systemMessage) => {
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    });

    socket.current?.on("outRoom", (room) => {
      const isUserOutRoom =
        room.User1Join === false || room.User2Join === false;
      setChatDisable(isUserOutRoom);
    });
    socket.current?.on("newRoom", (room) => {
      const isUserInRoom = room.User1Join && room.User2Join;
      setChatDisable(isUserInRoom && false);
    });

    socket.current?.on("resetRead", (roomId) => {
      if (roomId !== undefined) {
        setUserRoomList((prev) =>
          prev.map((room) =>
            room.id === roomId ? { ...room, UnReadMessages: [] } : room
          )
        );
      }
    });

    return () => {
      //다른 채팅방 클릭 시 방 나가기
      if (currentRoomId && me) {
        socket.current?.emit("leaveRoom", currentRoomId, me);
      }
      dispatch({ type: "RESET_CHAT_MESSAGES" });
      socket.current?.off("receiveMessage");
      socket.current?.off("systemMessage");
    };
  }, [dispatch, me, currentRoomId, setUserRoomList]);

  useEffect(() => {
    if (currentRoomId) {
      setMessages(
        chatMessages.filter((message) => message.ChatRoomId === currentRoomId)
      );
    }
  }, [chatMessages, currentRoomId]);

  //메시지 등록 시 스크롤 맞춤
  useEffect(() => {
    if (messageListContainerRef.current) {
      messageListContainerRef.current.scrollTop =
        messageListContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onExit = () => {
    if (window.confirm("정말 나가겠습니까?")) {
      socket.current?.emit("outRoom", currentRoomId, me);
      setActiveRoom(null);
    }
  };

  const toggleDeleteButton = (messageId: number) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  const handleDeleteMessage = (messageId: number, message: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: "삭제된 메시지입니다" } : msg
      )
    );
    socket.current?.emit("deletedMessage", messageId, currentRoomId, message);
    setSelectedMessageId(null);
  };

  const roomName =
    room?.User1?.id === me?.id ? room?.User2?.nickname : room?.User1?.nickname;

  return (
    <ChatRoomContainer>
      <ChatRoomCloseButton
        onClick={() => setActiveRoom(null)}
      ></ChatRoomCloseButton>
      <RoomHeader>
        <ChatPartnerName>{roomName} 님과의 채팅</ChatPartnerName>
        <ExitButton onClick={onExit}>나가기</ExitButton>
      </RoomHeader>
      <MessageList
        messages={messages}
        messageListContainerRef={messageListContainerRef}
        me={me}
        toggleDeleteButton={toggleDeleteButton}
        handleDeleteMessage={handleDeleteMessage}
        selectedMessageId={selectedMessageId}
      />
      <MessageForm
        chatDisable={chatDisable}
        socket={socket}
        currentRoomId={currentRoomId}
        me={me}
        selectedUserId={selectedUserId}
      />
    </ChatRoomContainer>
  );
};

export default ChatRoom;

const ChatRoomContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    min-height: 100vh;
    z-index: 2000;
  }
`;

const ChatRoomCloseButton = styled.button`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: silver;
  width: 100px;
  height: 10px;
  border-radius: 0 0 5px 5px;
  &:hover {
    background-color: #ddd;
  }
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  height: 30px;
`;

const ChatPartnerName = styled.h2`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ExitButton = styled.button`
  border-radius: 5px;
  padding: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }

  @media (max-width: 768px) {
    padding: 3px;
    font-size: 12px;
  }
`;
