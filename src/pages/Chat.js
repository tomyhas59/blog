import React, { useState } from "react";
import styled from "styled-components";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newMessage = {
        id: new Date().getTime(),
        sender: "You",
        text: inputValue,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <ChatContainer>
      <h2>Chat</h2>
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
          placeholder="Type a message..."
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
