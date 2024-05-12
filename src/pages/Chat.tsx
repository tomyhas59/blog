import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";
import { RootState } from "../reducer";
import { UserType } from "../types";

const socket =
  process.env.NODE_ENV === "production"
    ? io("https://port-0-blog-server-rccln2llvsdixmg.sel5.cloudtype.app")
    : io("http://localhost:3075");

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { me } = useSelector((state: RootState) => state.user);
  const [userList, setUserList] = useState<UserType[] | null>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  console.log("userList", userList);

  useEffect(() => {
    if (me) {
      const userInfo = { id: me.id, nickname: me.nickname };
      socket.emit("loginUser", userInfo);
    }

    socket.on("updateUserList", (updatedUserList: UserType[]) => {
      setUserList(updatedUserList);
    });

    return () => {
      socket.off("updateUserList");
    };
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages: Message[]) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleMessageSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newMessage = {
        id: new Date().getTime(),
        sender: me?.nickname || null,
        text: inputValue,
        time: moment().format("HH:mm"),
      };
      socket.emit("sendMessage", newMessage);
      setInputValue("");
      messageRef.current?.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <ChatContainer>
      <ChatWrapper>
        <ChatHeader>단체 채팅방</ChatHeader>
        <MessageList>
          {messages.map((v) => (
            <MessageItem key={v.id} isMe={v.sender === me?.nickname}>
              <MessageSender>{v.sender}</MessageSender>
              <MessageText isMe={v.sender === me?.nickname}>
                {v.text}
              </MessageText>
              <MessageTime>{v.time}</MessageTime>
            </MessageItem>
          ))}
        </MessageList>
        <MessageForm onSubmit={handleMessageSubmit}>
          <MessageInput
            type="text"
            placeholder="메시지를 입력해주세요"
            value={inputValue}
            ref={messageRef}
            onChange={handleInputChange}
          />
          <MessageButton type="submit">전송</MessageButton>
        </MessageForm>
      </ChatWrapper>
      <UserList>
        <div>접속 중인 유저 : {userList?.length || 0}명</div>
        <ul>
          {userList?.map((user) => (
            <li key={user.id}>{user.nickname}</li>
          ))}
        </ul>
      </UserList>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const UserList = styled.div`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;
  margin-left: 100px;
  > ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    > li {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
`;

const ChatWrapper = styled.div`
  width: 600px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ChatHeader = styled.h2`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;
  margin-bottom: 10px;
`;

const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

interface MessageItemProps {
  isMe: boolean;
}

const MessageItem = styled.li<MessageItemProps>`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row" : "row-reverse")};
  align-items: flex-start;
`;
interface MessageTextProps {
  isMe: boolean;
}

const MessageText = styled.p<MessageTextProps>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${(props) => (props.isMe ? "#f0f0f0" : "#ccc")};
  color: ${(props) => (props.isMe ? "#000" : "#000")};
  border-radius: 8px;
  max-width: 70%;
`;

const MessageSender = styled.span`
  font-weight: bold;
  line-height: 250%;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

const MessageButton = styled.button`
  flex: 0.1;
  padding: 10px 15px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;
