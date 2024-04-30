/* import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newMessage = {
        id: new Date().getTime(),
        sender: me.nickname,
        text: inputValue,
        time: moment().format("HH:mm"),
      };
      socket.emit("sendMessage", newMessage);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <ChatContainer>
      <ChatHeader>채팅방</ChatHeader>
      <MessageList>
        {messages.map((v) => (
          <MessageItem key={v.id} isMe={v.sender === me.nickname}>
            <MessageSender>{v.sender}</MessageSender>
            <MessageText isMe={v.sender === me.nickname}>{v.text}</MessageText>
            <MessageTime>{v.time}</MessageTime>
          </MessageItem>
        ))}
      </MessageList>
      <MessageForm onSubmit={handleMessageSubmit}>
        <MessageInput
          type="text"
          placeholder="메시지를 입력해주세요"
          value={inputValue}
          onChange={handleInputChange}
        />
        <MessageButton type="submit">전송</MessageButton>
      </MessageForm>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
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

const MessageItem = styled.li`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row" : "row-reverse")};
  align-items: flex-start;
`;

const MessageText = styled.p`
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
 */
