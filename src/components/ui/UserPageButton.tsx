import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./FollowButton";

const UserPageButton = ({ userId }: { userId: number }) => {
  console.log("----------", userId);
  const navigate = useNavigate();

  const handleGoToUserPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    navigate(`/user/${userId}`);
  };

  return <Button onClick={handleGoToUserPage}>페이지 방문</Button>;
};

export default UserPageButton;
