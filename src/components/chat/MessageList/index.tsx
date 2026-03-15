import React, { RefObject } from "react";
import moment from "moment";
import { MessageType, UserType } from "../../../types";
import * as S from "./MessageListStyles";

interface MessageListProps {
  messages: MessageType[];
  messageListContainerRef: RefObject<HTMLDivElement>;
  me: UserType | null;
  selectedMessageId: number | null;
  toggleDeleteButton: (messageId: number) => void;
  handleDeleteMessage: (messageId: number, message: string) => void;
}

const MessageList = ({
  messages,
  messageListContainerRef,
  me,
  selectedMessageId,
  handleDeleteMessage,
  toggleDeleteButton,
}: MessageListProps) => {
  return (
    <S.ListContainer ref={messageListContainerRef}>
      <S.ListWrapper>
        {messages.length === 0 ? (
          <S.DateLine>
            <span>메시지가 없습니다</span>
          </S.DateLine>
        ) : (
          messages.map((message, i) => {
            const isSystemMessage = message.content.includes("systemMessage");
            const isDeletedMessage = message.content.includes("deletedMessage");
            const isMe = message.User?.id === me?.id;

            // 메시지 내용 파싱 (원본 로직 유지)
            const displayContent = isSystemMessage
              ? message.content.replace("systemMessage", "")
              : isDeletedMessage
                ? "삭제된 메시지입니다"
                : message.content;

            // 날짜 변경선 렌더링 조건
            const showDateDivider =
              i === 0 ||
              !moment(message.createdAt).isSame(
                messages[i - 1].createdAt,
                "day",
              );

            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <S.DateLine>
                    <span>
                      {moment(message.createdAt).format("YYYY년 MM월 DD일")}
                    </span>
                  </S.DateLine>
                )}

                <S.MessageItem isMe={isMe} isSystem={isSystemMessage}>
                  <S.MessageContent
                    isMe={isMe}
                    isSystem={isSystemMessage}
                    onClick={() => toggleDeleteButton(message.id)}
                  >
                    {displayContent}
                  </S.MessageContent>

                  {!isSystemMessage && (
                    <S.Timestamp>
                      {moment(message.createdAt).format("A h:mm")}
                    </S.Timestamp>
                  )}

                  {isMe &&
                    selectedMessageId === message.id &&
                    !isDeletedMessage && (
                      <S.DeleteBtn
                        onClick={() =>
                          handleDeleteMessage(message.id, message.content)
                        }
                      >
                        삭제
                      </S.DeleteBtn>
                    )}
                </S.MessageItem>
              </React.Fragment>
            );
          })
        )}
      </S.ListWrapper>
    </S.ListContainer>
  );
};

export default MessageList;
