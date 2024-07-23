// FollowButton.tsx
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer";

interface FollowButtonProps {
  userId: number;
  setShowInfo?: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveUserOption?: React.Dispatch<React.SetStateAction<string | null>>;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  setShowInfo,
  setActiveUserOption,
}) => {
  const dispatch = useDispatch();
  const me = useSelector((state: RootState) => state.user.me);

  const onFollow = useCallback(() => {
    dispatch({ type: FOLLOW_REQUEST, data: userId });
    if (setShowInfo) {
      setShowInfo(false);
    }
    if (setActiveUserOption) {
      setActiveUserOption(null);
    }
  }, [dispatch, setActiveUserOption, setShowInfo, userId]);

  const onUnFollow = useCallback(() => {
    dispatch({ type: UNFOLLOW_REQUEST, data: userId });
    if (setShowInfo) {
      setShowInfo(false);
    }
    if (setActiveUserOption) {
      setActiveUserOption(null);
    }
  }, [dispatch, setActiveUserOption, setShowInfo, userId]);

  if (!me) return null;

  const isFollowing = me?.Followings.some(
    (following) => following.id === userId
  );

  return (
    <Button onClick={isFollowing ? onUnFollow : onFollow}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  height: 30px;
  font-size: 12px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: #000;
  }
`;

export default FollowButton;
