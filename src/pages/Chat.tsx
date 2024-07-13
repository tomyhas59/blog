import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
  useRef,
  useCallback,
  RefObject,
} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";
import { RootState } from "../reducer";
import { Message, UserType } from "../types";
import { useDispatch } from "react-redux";
import {
  ADD_CHAT_MESSAGE_REQUEST,
  DELETE_ALL_CHAT_REQUEST,
  READ_CHAT_REQUEST,
} from "../reducer/post";
import useOutsideClick from "../hooks/useOutsideClick";

const socket =
  process.env.NODE_ENV === "production"
    ? io("https://quarrelsome-laura-tomyhas59-09167dc6.koyeb.app")
    : io("http://localhost:3075");

interface AllChatRoomType {
  messages: Message[];
  me: UserType | null;
  onDeleteAllMessages: () => void;
  onMessageSubmit: (e: SyntheticEvent) => void;
  inputValue: string;
  messageRef: RefObject<HTMLInputElement>;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AllChatRoom = ({
  messages,
  me,
  onDeleteAllMessages,
  onMessageSubmit,
  inputValue,
  messageRef,
  onInputChange,
}: AllChatRoomType) => (
  <>
    <ChatHeader>단체 채팅방</ChatHeader>
    {me?.nickname === "admin" && (
      <button onClick={onDeleteAllMessages}>모든 대화 삭제</button>
    )}
    <MessageList>
      {messages.map((message, i) => (
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
          <MessageItem key={message.id} isMe={message.sender === me?.nickname}>
            <MessageSender>{message.sender.slice(0, 5)}</MessageSender>
            <MessageText isMe={message.sender === me?.nickname}>
              {message.content}
            </MessageText>
            <MessageTime>
              {moment(message.createdAt).format("HH:mm")}
            </MessageTime>
          </MessageItem>
        </React.Fragment>
      ))}
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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { chatMessages } = useSelector((state: RootState) => state.post);
  const { me } = useSelector((state: RootState) => state.user);
  const [userList, setUserList] = useState<UserType[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: READ_CHAT_REQUEST,
    });
  }, [dispatch]);

  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages]);

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

  const onMessageSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newMessage = {
        id: new Date().getTime(),
        sender: me?.nickname || null,
        content: inputValue,
        createdAt: new Date().getTime(),
      };
      socket.emit("sendMessage", newMessage);
      setInputValue("");
      messageRef.current?.focus();
      dispatch({
        type: ADD_CHAT_MESSAGE_REQUEST,
        data: { content: inputValue, sender: me!.nickname },
      });
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onDeleteAllMessages = useCallback(() => {
    dispatch({
      type: DELETE_ALL_CHAT_REQUEST,
    });
  }, [dispatch]);

  const [userOption, setUserOption] = useState<boolean>(false);

  const onUserOption = () => {
    setUserOption((prev) => !prev);
  };

  const userOptoinRef = useRef<HTMLDivElement>(null);

  useOutsideClick([userOptoinRef], () => {
    setUserOption(false);
  });

  const [activeRoom, setActiveRoom] = useState("allChat");
  const [roomList, setRoomList] = useState<string[]>([]);

  const renderRoom = () => {
    switch (activeRoom) {
      case "allChat":
        return (
          <AllChatRoom
            messages={messages}
            me={me}
            onDeleteAllMessages={onDeleteAllMessages}
            onMessageSubmit={onMessageSubmit}
            inputValue={inputValue}
            messageRef={messageRef}
            onInputChange={onInputChange}
          />
        );
      case selectedUser:
        return (
          <>
            <ChatHeader>{selectedUser}님과의 1:1 채팅방</ChatHeader>
          </>
        );
      default:
        return (
          <AllChatRoom
            messages={messages}
            me={me}
            onDeleteAllMessages={onDeleteAllMessages}
            onMessageSubmit={onMessageSubmit}
            inputValue={inputValue}
            messageRef={messageRef}
            onInputChange={onInputChange}
          />
        );
    }
  };

  return (
    <ChatContainer>
      <RoomList>
        <RoomItem>
          <button onClick={() => setActiveRoom("allChat")}>전체 채팅방</button>
        </RoomItem>
        {roomList.map((room) => (
          <RoomItem>
            <button
              onClick={() => {
                setSelectedUser(room);
                setActiveRoom(room);
              }}
            >
              {room}방
            </button>
          </RoomItem>
        ))}
      </RoomList>

      <ChatWrapper>{renderRoom()}</ChatWrapper>
      <UserList>
        <div>{userList?.length || 0}명 접속 중</div>
        <ul>
          {userList?.map((user) => (
            <li key={user.id}>
              <button onClick={onUserOption}>
                {user.nickname.slice(0, 5)}
              </button>
              {userOption && (
                <UserOption ref={userOptoinRef}>
                  <button
                    onClick={() => {
                      setSelectedUser(user.nickname);
                      setActiveRoom(user.nickname);
                      setRoomList((prev) => {
                        if (!prev.includes(user.nickname)) {
                          return [...prev, user.nickname];
                        }
                        return prev;
                      });
                      setUserOption(false);
                    }}
                  >
                    1:1 채팅하기
                  </button>
                  <button>팔로우</button>
                </UserOption>
              )}
            </li>
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
  @media (max-width: 480px) {
    display: block;
  }
`;

const RoomList = styled.div`
  width: 200px;
  padding: 10px;
  background-color: #f0f0f0;
  margin-right: 20px;
  text-align: center;
`;

const RoomItem = styled.div`
  padding: 5px;
  margin-bottom: 5px;
  background-color: #ccc;
`;

const ChatWrapper = styled.div`
  width: 600px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  @media (max-width: 480px) {
    width: 340px;
  }
`;

const UserList = styled.div`
  color: ${(props) => props.theme.mainColor};
  font-size: 24px;
  margin-left: 20px;
  > ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    > li {
      position: relative;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  @media (max-width: 480px) {
    font-size: 12px;
    position: absolute;
    > ul {
      flex-direction: row;
    }
  }
`;

const UserOption = styled.div`
  left: 20px;
  font-size: 12px;
  position: absolute;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 5px;
  color: #fff;
  text-align: center;
  & button {
    width: 70px;
    margin: 10px;
    &:hover {
      color: ${(props) => props.theme.charColor};
    }
  }
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

const MessageSender = styled.span`
  font-weight: bold;
  line-height: 250%;
`;

const MessageText = styled.p<MessageTextProps>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${(props) => (props.isMe ? "#f0f0f0" : "#ccc")};
  color: ${(props) => (props.isMe ? "#000" : "#000")};
  border-radius: 8px;
  max-width: 70%;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
  align-self: end;
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: 10px;
  @media (max-width: 480px) {
    height: 50px;
  }
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
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const DateSeparator = styled.div`
  width: 100%;
  font-size: 10px;
  color: #ccc;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  text-align: center;
`;
