import React, {
  ChangeEvent,
  RefObject,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { UserType } from "../../../types";
import * as S from "./MessageFormStyles";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (trimmedValue !== "" && socket.current) {
      const messageData = {
        content: trimmedValue,
        roomId: currentRoomId,
        userId: me?.id,
      };

      // 원본 로직 유지: 소켓 메시지 전송
      socket.current.emit("sendMessage", messageData, selectedUserId);

      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <S.FormContainer onSubmit={handleMessageSubmit}>
      <S.InputField
        type="text"
        placeholder={
          chatDisable
            ? "상대방이 채팅방을 나갔습니다"
            : "메시지를 입력해주세요..."
        }
        value={inputValue}
        ref={inputRef}
        onChange={handleInputChange}
        disabled={chatDisable}
      />
      <S.SubmitBtn type="submit" disabled={chatDisable || !inputValue.trim()}>
        전송
      </S.SubmitBtn>
    </S.FormContainer>
  );
};

export default MessageForm;
