import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StyledButton } from "../post/PostCommonStyles";

const UserPageButton = ({
  userId,
  content,
}: {
  userId: number;
  content?: string;
}) => {
  const navigate = useNavigate();

  const handleGoToUserPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  return (
    <VisitButton onClick={handleGoToUserPage}>
      {content ? content : "프로필 방문"}
    </VisitButton>
  );
};

// 공통 스타일을 확장하여 "방문" 버튼만의 아이덴티티 부여
const VisitButton = styled(StyledButton)`
  background-color: #ffffff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  text-align: center;
  margin-top: 2px;

  /* 아이콘 느낌을 살짝 주기 위한 포인트 (선택 사항) */
  &:before {
    content: "🏠";
    margin-right: 6px;
    font-size: 11px;
  }

  &:hover {
    background-color: #f9fafb;
    border-color: ${(props) => props.theme.mainColor || "#3b82f6"};
    color: ${(props) => props.theme.mainColor || "#3b82f6"};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default UserPageButton;
