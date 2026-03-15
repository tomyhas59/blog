// ChatStyles.ts에 추가

import styled from "styled-components";

export const ListContainer = styled.div`
  overflow-y: auto;
  height: 60vh;
  position: relative;
  padding: 10px;
  background-color: #fcfcfc;

  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 120px);
  }
`;

export const ListWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MessageItem = styled.li<{ isMe: boolean; isSystem: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isMe ? "row-reverse" : "row")};
  justify-content: ${(props) => (props.isSystem ? "center" : "flex-start")};
  align-items: flex-end;
  gap: 6px;
  margin-bottom: 4px;
`;

export const MessageContent = styled.p<{ isMe: boolean; isSystem: boolean }>`
  margin: 0;
  padding: 8px 12px;
  font-size: 0.95rem;
  border-radius: 12px;
  max-width: 70%;
  word-break: break-all;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.isSystem ? "none" : "0 1px 2px rgba(0,0,0,0.05)"};

  background-color: ${(props) =>
    props.isSystem
      ? "transparent"
      : props.isMe
        ? props.theme.mainColor
        : "#fff"};
  color: ${(props) =>
    props.isSystem ? "#ff4d4f" : props.isMe ? "#fff" : "#333"};
  border: ${(props) =>
    props.isMe || props.isSystem ? "none" : "1px solid #eee"};

  /* 시스템 메시지 스타일 전용 */
  ${(props) =>
    props.isSystem &&
    `
    font-size: 0.8rem;
    font-weight: 500;
    text-align: center;
  `}

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #aaa;
  margin-bottom: 2px;
`;

export const DateLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  font-size: 0.75rem;
  color: #bbb;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
  }
  span {
    padding: 0 10px;
  }
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ff7875;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0 5px;
  &:hover {
    text-decoration: underline;
  }
`;
