import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
  RefObject,
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
  onDeleteAllMessages: () => void;
  onMessageSubmit: (e: SyntheticEvent) => void;
  inputValue: string;
  messageRef: RefObject<HTMLInputElement>;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedUser: UserType | null;
  room: UserRoomList | null;
}
interface SystemMessage {
  content: string;
  type: string;
  createdAt: Date;
}

const OneOnOneChatRoom = ({
  me,
  onMessageSubmit,
  inputValue,
  messageRef,
  onInputChange,
  room,
  selectedUser,
}: OneOnOneChatRoomType) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const { chatMessages } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const roomId = room?.id;
  const socket = useRef<Socket | null>(null);

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
    if (roomId) {
      dispatch({
        type: READ_CHAT_REQUEST,
        data: roomId,
      });
    }
  }, [dispatch, roomId]);

  useEffect(() => {
    socket.current?.emit("joinRoom", roomId, me?.nickname, selectedUser?.id);

    socket.current?.on("receiveMessage", (message) => {
      setMessages((prevMessages: Message[]) => [...prevMessages, message]);
    });

    socket.current?.on("systemMessage", (message: SystemMessage) => {
      setSystemMessages((prevSystemMessages: SystemMessage[]) => [
        ...prevSystemMessages,
        message,
      ]);
    });

    return () => {
      socket.current?.emit("leaveRoom", roomId, me?.nickname);
      socket.current?.off("receiveMessage");
      socket.current?.off("systemMessage");
      dispatch({
        type: "RESET_CHAT_MESSAGES",
      });
    };
  }, [dispatch, me?.nickname, roomId, selectedUser?.id]);

  useEffect(() => {
    if (roomId) {
      setMessages(
        chatMessages.filter((message) => message.ChatRoomId === roomId)
      );
    }
  }, [chatMessages, roomId]);

  return (
    <>
      <ChatHeader>
        {room && room.User1?.nickname}, {room && room.User2?.nickname}의 방
      </ChatHeader>
      <MessageList>
        {messages.length < 1 ? (
          <div>메시지가 없습니다</div>
        ) : (
          messages.map((message, i) => (
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
              <MessageItem key={message.id} isMe={message.User.id === me?.id}>
                <MessageSender>
                  {message.User.nickname.slice(0, 5)}
                </MessageSender>
                <MessageText isMe={message.User.id === me?.id}>
                  {message.content}
                </MessageText>
                <MessageTime>
                  {moment(message.createdAt).format("HH:mm")}
                </MessageTime>
              </MessageItem>
            </React.Fragment>
          ))
        )}
      </MessageList>
      <MessageForm onSubmit={onMessageSubmit}>
        <MessageInput
          type="text"
          placeholder="메시지를 입력해주세요"
          value={inputValue}
          ref={messageRef}
          onChange={onInputChange}
        />
        <MessageButton type="submit">전송</MessageButton>
      </MessageForm>
    </>
  );
};

export default OneOnOneChatRoom;

export const ChatHeader = styled.h2`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;
  margin-bottom: 10px;
`;

export const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export interface MessageItemProps {
  isMe: boolean;
}

export const MessageItem = styled.li<MessageItemProps>`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row" : "row-reverse")};
  align-items: flex-start;
`;

export interface MessageTextProps {
  isMe: boolean;
}

export const MessageSender = styled.span`
  font-weight: bold;
  line-height: 250%;
`;

export const MessageText = styled.p<MessageTextProps>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${(props) => (props.isMe ? "#f0f0f0" : "#ccc")};
  color: "#000";
  border-radius: 8px;
  max-width: 70%;
`;

export const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
  align-self: end;
`;

export const MessageForm = styled.form`
  display: flex;
  margin-top: 10px;
  @media (max-width: 480px) {
    height: 50px;
  }
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

export const MessageButton = styled.button`
  flex: 0.1;
  padding: 10px 15px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const DateSeparator = styled.div`
  width: 100%;
  font-size: 10px;
  color: #ccc;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  text-align: center;
`;
