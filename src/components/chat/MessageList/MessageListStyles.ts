import styled from "styled-components";

// ===== 메시지 컨테이너 =====
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: ${(props) => props.theme.activeColor};

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.borderColor};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// ===== 빈 메시지 =====
export const EmptyMessages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(props) => props.theme.textColor};
  opacity: 0.5;

  i {
    font-size: 48px;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

// ===== 날짜 구분선 =====
export const DateDivider = styled.div`
  text-align: center;
  margin: 24px 0;
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 35%;
    height: 1px;
    background-color: ${(props) => props.theme.borderColor};
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  @media (max-width: 768px) {
    margin: 20px 0;
    font-size: 11px;
  }
`;

// ===== 시스템 메시지 =====
export const SystemMessage = styled.div`
  text-align: center;
  margin: 16px auto;
  padding: 8px 16px;
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  background-color: ${(props) => props.theme.borderColor};
  border-radius: 12px;
  display: inline-block;
  max-width: 80%;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
  }
`;

// ===== 메시지 래퍼 (완전히 새로운 구조) =====
export const MessageWrapper = styled.div<{ isMe: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: ${(props) => (props.isMe ? "flex-end" : "flex-start")};

  @media (max-width: 768px) {
    margin-bottom: 14px;
    gap: 6px;
  }
`;

// ===== 메시지 콘텐츠 그룹 =====
export const MessageContent = styled.div<{ isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isMe ? "flex-end" : "flex-start")};
  max-width: 70%;
  gap: 4px;

  @media (max-width: 768px) {
    max-width: 75%;
  }
`;

// ===== 메시지 버블 =====
export const MessageBubble = styled.div<{ isMe: boolean; isDeleted: boolean }>`
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  cursor: ${(props) => (props.isDeleted ? "default" : "pointer")};
  min-width: 60px;

  ${(props) =>
    props.isMe
      ? `
    background: linear-gradient(135deg, ${props.theme.mainColor}, ${props.theme.subColor});
    color: white;
    border-bottom-right-radius: 4px;
  `
      : `
    background-color: ${props.theme.backgroundColor};
    color: ${props.theme.textColor};
    border: 1px solid ${props.theme.borderColor};
    border-bottom-left-radius: 4px;
  `}

  ${(props) =>
    props.isDeleted &&
    `
    opacity: 0.6;
    font-style: italic;
  `}

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 14px;
  }
`;

// ===== 메시지 정보 (시간 + 삭제 버튼) =====
export const MessageInfo = styled.div<{ isMe: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-direction: ${(props) => (props.isMe ? "row-reverse" : "row")};
`;

// ===== 메시지 시간 =====
export const MessageTime = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

// ===== 삭제 버튼 =====
export const DeleteButton = styled.button`
  padding: 4px 10px;
  background-color: #ff4757;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #ff3838;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  i {
    margin-right: 4px;
  }

  @media (max-width: 768px) {
    padding: 3px 8px;
    font-size: 10px;
  }
`;
