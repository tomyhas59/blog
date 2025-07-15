import moment from "moment";
import React, { RefObject } from "react";
import styled from "styled-components";
import { MessageType, UserType } from "../../types";

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
    <MessageListContainer ref={messageListContainerRef}>
      <MessageListWrapper>
        {messages.length === 0 ? (
          <EmptyMessage>메시지가 없습니다</EmptyMessage>
        ) : (
          messages.map((message, i) => {
            const isSystemMessage = message.content.includes("systemMessage");
            const isDeletedMessage = message.content.includes("deletedMessage");
            const messageContent = isSystemMessage
              ? message.content.replace("systemMessage", "")
              : isDeletedMessage
              ? "삭제된 메시지입니다"
              : message.content;

            return (
              <React.Fragment key={message.id}>
                {i === 0 ||
                moment(message.createdAt).isAfter(
                  messages[i - 1].createdAt,
                  "day"
                ) ? (
                  <DateDivider>
                    {moment(message.createdAt).format("YYYY-MM-DD")}
                  </DateDivider>
                ) : null}
                <MessageItem
                  isMe={message.User?.id === me?.id}
                  isSystemMessage={isSystemMessage}
                >
                  <SenderName isSystemMessage={isSystemMessage}>
                    {message.User?.nickname.slice(0, 5)}
                  </SenderName>
                  <MessageContent
                    isMe={message.User?.id === me?.id}
                    isSystemMessage={isSystemMessage}
                    onClick={() => toggleDeleteButton(message.id)}
                  >
                    {messageContent}
                  </MessageContent>
                  <MessageTimestamp isSystemMessage={isSystemMessage}>
                    {moment(message.createdAt).format("HH:mm")}
                  </MessageTimestamp>
                  {message.UserId === me?.id &&
                    selectedMessageId === message.id && (
                      <DeleteMessageButton
                        onClick={() =>
                          handleDeleteMessage(message.id, message.content)
                        }
                      >
                        삭제
                      </DeleteMessageButton>
                    )}
                </MessageItem>
              </React.Fragment>
            );
          })
        )}
      </MessageListWrapper>
    </MessageListContainer>
  );
};

export default MessageList;

const MessageListContainer = styled.div`
  overflow-y: auto;
  height: 60vh;
  position: relative;
  @media (max-width: 768px) {
    height: calc(100vh - 100px);
  }
`;

const MessageListWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
`;

interface MessageItemProps {
  isMe: boolean;
  isSystemMessage: boolean;
}

const MessageItem = styled.li<MessageItemProps>`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row" : "row-reverse")};
  justify-content: ${(props) =>
    props.isSystemMessage ? "center" : "flex-start"};
`;

const SenderName = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  line-height: 1.5;
`;

const MessageContent = styled.p<MessageItemProps>`
  margin: 5px 0;
  padding: 5px 10px;

  background-color: ${(props) =>
    props.isSystemMessage ? "transparent" : props.isMe ? "#d4f1f4" : "#f0f0f0"};
  color: ${(props) => (props.isSystemMessage ? "red" : "#000")};
  border-radius: 8px;
  max-width: 70%;
  word-break: keep-all;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const MessageTimestamp = styled.span<Pick<MessageItemProps, "isSystemMessage">>`
  display: ${(props) => (props.isSystemMessage ? "none" : "inline")};
  font-size: 12px;
  color: #999;
  align-self: flex-end;
  margin-left: 5px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px;
`;

const DeleteMessageButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
`;

const DateDivider = styled.div`
  width: 100%;
  font-size: 10px;
  color: #ccc;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 8px;
    margin: 5px 0;
  }
`;
