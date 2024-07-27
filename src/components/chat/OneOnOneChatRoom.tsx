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
import { Message, UserType } from "../../types";
import { useDispatch } from "react-redux";
import { READ_CHAT_REQUEST } from "../../reducer/post";
import styled from "styled-components";
import { UserRoomList } from "../../pages/Chat";

interface OneOnOneChatRoomType {
  me: UserType | null;
  selectedUserId: number | null;
  room: UserRoomList | null;
  setActiveRoom: (room: UserRoomList | null) => void;
  setUserRoomList: React.Dispatch<React.SetStateAction<UserRoomList[]>>;
}

const OneOnOneChatRoom = ({
  me,
  room,
  selectedUserId,
  setActiveRoom,
  setUserRoomList,
}: OneOnOneChatRoomType) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { chatMessages } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const currentRoomId = room?.id;
  const socket = useRef<Socket | null>(null);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const messageRef = useRef<HTMLInputElement>(null);
  const [chatdisable, setChatDisable] = useState<boolean>();

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://quarrelsome-laura-tomyhas59-09167dc6.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentRoomId) {
      dispatch({
        type: READ_CHAT_REQUEST,
        data: currentRoomId,
      });
    }
  }, [dispatch, currentRoomId]);

  useEffect(() => {
    socket.current?.emit("joinRoom", currentRoomId, me);

    socket.current?.on("receiveMessage", (message) => {
      if (message.ChatRoomId === currentRoomId)
        setMessages((prevMessages: Message[]) => [...prevMessages, message]);
    });

    socket.current?.on("systemMessage", (systemMessage) => {
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        systemMessage,
      ]);
    });

    socket.current?.on("outRoom", () => setChatDisable(true));
    socket.current?.on("joinRoom", () => setChatDisable(false));

    socket.current?.on("resetRead", (roomId) => {
      if (roomId !== undefined) {
        setUserRoomList((prev: UserRoomList[]) =>
          prev.map((room) =>
            room.id === roomId ? { ...room, UnReadMessages: [] } : room
          )
        );
      }
    });

    return () => {
      dispatch({
        type: "RESET_CHAT_MESSAGES",
      });
      socket.current?.off("receiveMessage");
      socket.current?.off("systemMessage");

      socket.current?.emit("leaveRoom", currentRoomId, me);
    };
  }, [dispatch, me, currentRoomId, setUserRoomList]);

  useEffect(() => {
    if (currentRoomId) {
      setMessages(
        chatMessages.filter((message) => message.ChatRoomId === currentRoomId)
      );
    }
  }, [chatMessages, currentRoomId]);

  useEffect(() => {
    // 스크롤을 메시지 리스트의 마지막으로 이동
    if (messageListContainerRef.current) {
      messageListContainerRef.current.scrollTop =
        messageListContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onMessageSubmit = (e: SyntheticEvent) => {
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

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const oneExit = () => {
    const isConfirmed = window.confirm("정말 나가겠습니까?");
    if (isConfirmed) {
      socket.current?.emit("outRoom", currentRoomId, me);
      setActiveRoom(null);
    }
  };

  const roomName =
    room?.User1?.id === me?.id ? room?.User2?.nickname : room?.User1?.nickname;

  return (
    <ChatRoomContainer>
      <RoomHeader>
        <RoomName>{roomName}님과의 채팅</RoomName>
        <ExitButton onClick={oneExit}>나가기</ExitButton>
      </RoomHeader>
      <MessageListContainer ref={messageListContainerRef}>
        <MessageList>
          {messages.length < 1 ? (
            <div>메시지가 없습니다</div>
          ) : (
            messages.map((message, i) => {
              const isSystemMessage =
                typeof message?.content === "string" &&
                message.content.endsWith("systemMessage");
              const messageContent = isSystemMessage
                ? message?.content.replace("systemMessage", "")
                : message?.content;
              return (
                <React.Fragment key={message.id}>
                  {i === 0 ||
                  moment(message.createdAt).isAfter(
                    messages[i - 1].createdAt,
                    "day"
                  ) ? (
                    <DateSeparator>
                      {moment(message.createdAt).format("YYYY-MM-DD")}
                    </DateSeparator>
                  ) : null}
                  <MessageItem
                    key={message.id}
                    isMe={message.User?.id === me?.id}
                    isSystemMessage={isSystemMessage}
                  >
                    <MessageSender isSystemMessage={isSystemMessage}>
                      {message.User?.nickname.slice(0, 5)}
                    </MessageSender>
                    <MessageText
                      isMe={message.User?.id === me?.id}
                      isSystemMessage={isSystemMessage}
                    >
                      {messageContent}
                    </MessageText>
                    <MessageTime isSystemMessage={isSystemMessage}>
                      {moment(message.createdAt).format("HH:mm")}
                    </MessageTime>
                  </MessageItem>
                </React.Fragment>
              );
            })
          )}
        </MessageList>
      </MessageListContainer>
      <MessageForm onSubmit={onMessageSubmit}>
        <MessageInput
          type="text"
          placeholder={
            chatdisable ? "상대방이 나갔습니다" : "메시지를 입력해주세요"
          }
          value={inputValue}
          ref={messageRef}
          onChange={onInputChange}
          disabled={chatdisable}
        />
        <MessageButton type="submit" disabled={chatdisable}>
          전송
        </MessageButton>
      </MessageForm>
    </ChatRoomContainer>
  );
};

export default OneOnOneChatRoom;

const ChatRoomContainer = styled.div`
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 10px;
    width: 100%;
  }
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const RoomName = styled.h2`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;

  @media (max-width: 480px) {
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

  @media (max-width: 480px) {
    padding: 3px;
    font-size: 12px;
  }
`;

const MessageListContainer = styled.div`
  overflow-y: auto;
  height: 60vh;

  @media (max-width: 480px) {
    height: 40vh;
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

const MessageSender = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-weight: bold;
  line-height: 1.5;
`;

const MessageText = styled.p<MessageItemProps>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${(props) =>
    props.isSystemMessage ? "transparent" : props.isMe ? "#d4f1f4" : "#f0f0f0"};
  color: ${(props) => (props.isSystemMessage ? "red" : "#000")};
  border-radius: 8px;
  max-width: 70%;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const MessageTime = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-size: 12px;
  color: #999;
  align-self: flex-end;
  margin-left: 5px;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: 10px;

  @media (max-width: 480px) {
    margin-top: 5px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;

  @media (max-width: 480px) {
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

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const DateSeparator = styled.div`
  width: 100%;
  font-size: 10px;
  color: #ccc;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 8px;
    margin: 5px 0;
  }
`;
