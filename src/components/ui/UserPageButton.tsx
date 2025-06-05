import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./FollowButton";

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
    <Button onClick={handleGoToUserPage}>{content ? content : "방문"}</Button>
  );
};

export default UserPageButton;
