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
    <S.MessagesContainer ref={messageListContainerRef}>
      {messages.length === 0 ? (
        <S.EmptyMessages>
          <i className="far fa-comments"></i>
          <p>메시지가 없습니다</p>
        </S.EmptyMessages>
      ) : (
        messages.map((message, i) => {
          const isSystemMessage = message.content.includes("systemMessage");
          const isDeletedMessage = message.content.includes("deletedMessage");
          const isMe = message.User?.id === me?.id;

          const displayContent = isSystemMessage
            ? message.content.replace("systemMessage", "")
            : isDeletedMessage
              ? "삭제된 메시지입니다"
              : message.content;

          const showDateDivider =
            i === 0 ||
            !moment(message.createdAt).isSame(messages[i - 1].createdAt, "day");

          return (
            <React.Fragment key={message.id}>
              {showDateDivider && (
                <S.DateDivider>
                  {moment(message.createdAt).format("YYYY년 MM월 DD일")}
                </S.DateDivider>
              )}

              {isSystemMessage ? (
                <div style={{ textAlign: "center" }}>
                  <S.SystemMessage>{displayContent}</S.SystemMessage>
                </div>
              ) : (
                <S.MessageWrapper isMe={isMe}>
                  <S.MessageContent isMe={isMe}>
                    <S.MessageBubble
                      isMe={isMe}
                      isDeleted={isDeletedMessage}
                      onClick={() =>
                        !isDeletedMessage && toggleDeleteButton(message.id)
                      }
                    >
                      {displayContent}
                    </S.MessageBubble>
                    <S.MessageInfo isMe={isMe}>
                      <S.MessageTime>
                        {moment(message.createdAt).format("A h:mm")}
                      </S.MessageTime>
                      {isMe &&
                        selectedMessageId === message.id &&
                        !isDeletedMessage && (
                          <S.DeleteButton
                            onClick={() =>
                              handleDeleteMessage(message.id, message.content)
                            }
                          >
                            <i className="fas fa-trash"></i>
                            삭제
                          </S.DeleteButton>
                        )}
                    </S.MessageInfo>
                  </S.MessageContent>
                </S.MessageWrapper>
              )}
            </React.Fragment>
          );
        })
      )}
    </S.MessagesContainer>
  );
};

export default MessageList;
