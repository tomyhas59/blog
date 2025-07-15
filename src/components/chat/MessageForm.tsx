import React, {
  ChangeEvent,
  RefObject,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { UserType } from "../../types";

interface MessageFormProps {
  socket: RefObject<Socket | null>;
  currentRoomId?: number;
  me: UserType | null;
  selectedUserId: number | null;
  chatDisable: boolean;
}

const MessageForm = ({
  socket,
  currentRoomId,
  me,
  selectedUserId,
  chatDisable,
}: MessageFormProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const messageRef = useRef<HTMLInputElement>(null);

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

  return (
    <MessageFormContainer onSubmit={handleMessageSubmit}>
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
    </MessageFormContainer>
  );
};

export default MessageForm;

const MessageFormContainer = styled.form`
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
