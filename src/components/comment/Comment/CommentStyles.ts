import styled from "styled-components";

export const CommentContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const CommentItem = styled.div<{ isTop3Comments: boolean }>`
  border-top: 1px solid #e1e1e1;
  font-size: 15px;
  background-color: ${(props) =>
    props.isTop3Comments ? props.theme.top3Color : "transparent"};
  transition: all 1s ease-in-out;
  padding: 15px 10px;
`;

export const CommentHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const AuthorWrapper = styled.button`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
  color: ${(props) => props.theme.textColor};
  transition: all 0.3s ease;

  img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    object-fit: cover;
  }

  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 35px;
  left: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 5px;
  z-index: 999;
  gap: 4px;
`;

export const ContentBox = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
`;

export const CommentBody = styled.div`
  width: 95%;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${(props) => props.theme.textColor};
`;

export const EditArea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 0.9rem;
  border: 1px solid ${(props) => props.theme.mainColor};
  border-radius: 4px;
  resize: none;
`;

export const ControlBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
`;

export const ActionBtn = styled.button<{ colorType?: "main" | "sub" }>`
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: ${(props) =>
    props.colorType === "main" ? props.theme.mainColor : "#888"};

  &:hover {
    transform: translateY(-1px);
    color: ${(props) => props.theme.hoverMainColor};
  }
`;

export const PrimaryBtn = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  font-size: 12px;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const TimeStamp = styled.span`
  color: #999;
  font-size: 12px;
  margin-right: auto;
`;
