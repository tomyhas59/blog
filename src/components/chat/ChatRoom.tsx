import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import moment from "moment";
import { RootState } from "../../reducer";
import { MessageType, UserType } from "../../types";
import { useDispatch } from "react-redux";
import { READ_CHAT_REQUEST } from "../../reducer/post";
import styled from "styled-components";
import { UserRoomList } from "../../pages/Chat";

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
  const [inputValue, setInputValue] = useState<string>("");
  const messageRef = useRef<HTMLInputElement>(null);
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

  const handleMessageSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const messageData = {
        content: inputValue,
        roomId: currentRoomId,
        userId: me?.id,
      };
      socket.current?.emit("sendMessage", messageData, selectedUserId);
      setInputValue("");
      messageRef.current?.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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
      <MessageListContainer ref={messageListContainerRef}>
        <MessageList>
          {messages.length === 0 ? (
            <EmptyMessage>메시지가 없습니다</EmptyMessage>
          ) : (
            messages.map((message, i) => {
              const isSystemMessage = message.content.includes("systemMessage");
              const isDeletedMessage =
                message.content.includes("deletedMessage");
              const messageContent = isSystemMessage
                ? message.content.replace("systemMessage", "")
                : isDeletedMessage
                ? "삭제된 메시지입니다"
                : message.content;

              return (
                <React.Fragment key={message.id}>
                  {i === 0 ||
                  moment(message.createdAt).isAfter(
                    messages[i - 1].createdAt,
                    "day"
                  ) ? (
                    <DateDivider>
                      {moment(message.createdAt).format("YYYY-MM-DD")}
                    </DateDivider>
                  ) : null}
                  <MessageItem
                    isMe={message.User?.id === me?.id}
                    isSystemMessage={isSystemMessage}
                  >
                    <SenderName isSystemMessage={isSystemMessage}>
                      {message.User?.nickname.slice(0, 5)}
                    </SenderName>
                    <MessageContent
                      isMe={message.User?.id === me?.id}
                      isSystemMessage={isSystemMessage}
                      onClick={() => toggleDeleteButton(message.id)}
                    >
                      {messageContent}
                    </MessageContent>
                    <MessageTimestamp isSystemMessage={isSystemMessage}>
                      {moment(message.createdAt).format("HH:mm")}
                    </MessageTimestamp>
                    {message.UserId === me?.id &&
                      selectedMessageId === message.id && (
                        <DeleteMessageButton
                          onClick={() =>
                            handleDeleteMessage(message.id, message.content)
                          }
                        >
                          삭제
                        </DeleteMessageButton>
                      )}
                  </MessageItem>
                </React.Fragment>
              );
            })
          )}
        </MessageList>
      </MessageListContainer>
      <MessageForm onSubmit={handleMessageSubmit}>
        <MessageInput
          type="text"
          placeholder={
            chatDisable ? "상대방이 나갔습니다" : "메시지를 입력해주세요"
          }
          value={inputValue}
          ref={messageRef}
          onChange={handleInputChange}
          disabled={chatDisable}
        />
        <MessageButton type="submit" disabled={chatDisable}>
          전송
        </MessageButton>
      </MessageForm>
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

const MessageListContainer = styled.div`
  overflow-y: auto;
  height: 60vh;
  position: relative;
  @media (max-width: 768px) {
    height: calc(100vh - 100px);
  }
`;

const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

interface MessageItemProps {
  isMe: boolean;
  isSystemMessage: boolean;
}

const MessageItem = styled.li<MessageItemProps>`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row" : "row-reverse")};
  justify-content: ${(props) =>
    props.isSystemMessage ? "center" : "flex-start"};
`;

const SenderName = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  line-height: 1.5;
`;

const MessageContent = styled.p<MessageItemProps>`
  margin: 5px 0;
  padding: 5px 10px;

  background-color: ${(props) =>
    props.isSystemMessage ? "transparent" : props.isMe ? "#d4f1f4" : "#f0f0f0"};
  color: ${(props) => (props.isSystemMessage ? "red" : "#000")};
  border-radius: 8px;
  max-width: 70%;
  word-break: keep-all;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const MessageTimestamp = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-size: 12px;
  color: #999;
  align-self: flex-end;
  margin-left: 5px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const MessageForm = styled.form`
  display: flex;
  height: 40px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  color: ${(props) => props.theme.mainColor};
  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const MessageButton = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const DeleteMessageButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
`;

const DateDivider = styled.div`
  width: 100%;
  font-size: 10px;
  color: #ccc;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 8px;
    margin: 5px 0;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px;
`;
