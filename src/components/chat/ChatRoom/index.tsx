import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "../../../reducer";
import { MessageType, UserType } from "../../../types";
import { READ_CHAT_REQUEST } from "../../../reducer/post";
import { UserRoomList } from "../../../pages/Chat";

import MessageList from "../MessageList";
import MessageForm from "../MessageForm";
import * as S from "./ChatRoomStyles";

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
  const dispatch = useDispatch();
  const { chatMessages } = useSelector((state: RootState) => state.post);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatDisable, setChatDisable] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null,
  );

  const socket = useRef<Socket | null>(null);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);
  const currentRoomId = room?.id;

  // 1. 소켓 연결 및 초기화
  useEffect(() => {
    const socketUrl =
      process.env.NODE_ENV === "production"
        ? "https://patient-marina-tomyhas59-8c3582f9.koyeb.app"
        : "http://localhost:3075";

    socket.current = io(socketUrl);

    return () => {
      if (currentRoomId && me) {
        socket.current?.emit("leaveRoom", currentRoomId, me);
      }
      socket.current?.disconnect();
    };
  }, [currentRoomId, me]);

  // 2. 초기 데이터 로드
  useEffect(() => {
    if (currentRoomId) {
      dispatch({ type: READ_CHAT_REQUEST, data: currentRoomId });
    }
  }, [dispatch, currentRoomId]);

  // 3. 채팅방 활성화 상태 체크
  useEffect(() => {
    if (!room?.User1Join || !room.User2Join) setChatDisable(true);
  }, [room]);

  // 4. 소켓 이벤트 리스너
  useEffect(() => {
    const s = socket.current;
    s?.emit("joinRoom", currentRoomId, me);

    s?.on("receiveMessage", (message) => {
      if (message.ChatRoomId === currentRoomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    s?.on("systemMessage", (msg) => setMessages((prev) => [...prev, msg]));

    s?.on("outRoom", (updatedRoom) => {
      setChatDisable(!updatedRoom.User1Join || !updatedRoom.User2Join);
    });

    s?.on("newRoom", (updatedRoom) => {
      if (updatedRoom.User1Join && updatedRoom.User2Join) setChatDisable(false);
    });

    s?.on("resetRead", (roomId) => {
      if (roomId !== undefined) {
        setUserRoomList((prev) =>
          prev.map((r) => (r.id === roomId ? { ...r, UnReadMessages: [] } : r)),
        );
      }
    });

    return () => {
      if (currentRoomId && me) s?.emit("leaveRoom", currentRoomId, me);
      dispatch({ type: "RESET_CHAT_MESSAGES" });
      s?.off("receiveMessage");
      s?.off("systemMessage");
      s?.off("outRoom");
      s?.off("newRoom");
      s?.off("resetRead");
    };
  }, [dispatch, me, currentRoomId, setUserRoomList]);

  // 5. 메시지 필터링 및 동기화
  useEffect(() => {
    if (currentRoomId) {
      setMessages(chatMessages.filter((m) => m.ChatRoomId === currentRoomId));
    }
  }, [chatMessages, currentRoomId]);

  // 6. 스크롤 자동 하단 이동
  useEffect(() => {
    if (messageListContainerRef.current) {
      const container = messageListContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // 7. 핸들러 함수들
  const onExit = () => {
    if (window.confirm("정말 방에서 나가시겠습니까?")) {
      socket.current?.emit("outRoom", currentRoomId, me);
      setActiveRoom(null);
    }
  };

  const toggleDeleteButton = (messageId: number) => {
    setSelectedMessageId((prev) => (prev === messageId ? null : messageId));
  };

  const handleDeleteMessage = (messageId: number, content: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: "삭제된 메시지입니다" } : msg,
      ),
    );
    socket.current?.emit("deletedMessage", messageId, currentRoomId, content);
    setSelectedMessageId(null);
  };

  const partnerNickname =
    room?.User1?.id === me?.id ? room?.User2?.nickname : room?.User1?.nickname;

  return (
    <S.RoomContainer>
      <S.RoomHeader>
        <S.BackButton onClick={() => setActiveRoom(null)}>
          <i className="fas fa-arrow-left"></i>
        </S.BackButton>
        <S.PartnerInfo>
          <S.PartnerAvatar>
            {partnerNickname?.charAt(0).toUpperCase()}
          </S.PartnerAvatar>
          <S.PartnerName>{partnerNickname}</S.PartnerName>
        </S.PartnerInfo>
        <S.ExitButton onClick={onExit}>
          <i className="fas fa-sign-out-alt"></i>
          <span>나가기</span>
        </S.ExitButton>
      </S.RoomHeader>

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
    </S.RoomContainer>
  );
};

export default ChatRoom;
