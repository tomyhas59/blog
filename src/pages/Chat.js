import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // 소켓 서버 URL

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
      <h2>채팅</h2>
      <MessageList>
        {messages.map((message) => (
          <MessageItem key={message.id}>
            <MessageSender>{message.sender}: </MessageSender>
            <MessageText>{message.text}</MessageText>
          </MessageItem>
        ))}
      </MessageList>
      <form onSubmit={handleMessageSubmit}>
        <MessageInput
          type="text"
          placeholder="메시지를 입력해주세요"
          value={inputValue}
          onChange={handleInputChange}
        />
      </form>
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

const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MessageItem = styled.li`
  margin-bottom: 10px;
`;

const MessageSender = styled.span`
  font-weight: bold;
`;

const MessageText = styled.p`
  margin: 5px 0;
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
