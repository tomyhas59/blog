import styled from "styled-components";

export const NestedSection = styled.div`
  width: 95%;
  margin: 4px 0 4px auto;
  border-left: 2px solid ${(props) => props.theme.borderColor || "#eee"};
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const ReplyCard = styled.article`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #f9f9f9;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

export const ReplyHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  position: relative;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AuthorBox = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  .reply-icon {
    color: #ccc;
    font-size: 0.8rem;
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-weight: 600;
    font-size: 0.85rem;
    color: ${(props) => props.theme.textColor};
  }
`;

export const PopoverMenu = styled.nav`
  position: absolute;
  top: 32px;
  left: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Timestamp = styled.time`
  font-size: 0.75rem;
  color: #999;
`;

export const ReplyBody = styled.div`
  margin-left: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MessageText = styled.div`
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${(props) => props.theme.textColor};

  .mention {
    color: ${(props) => props.theme.mainColor};
    font-weight: 500;
    margin-right: 6px;
  }
`;

export const ActionTray = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button<{ variant?: "danger" }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.variant === "danger" ? "#ff7875" : "#bfbfbf")};
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    color: ${(props) =>
      props.variant === "danger" ? "#f5222d" : props.theme.mainColor};
    transform: scale(1.1);
  }
`;

export const BrandButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;
