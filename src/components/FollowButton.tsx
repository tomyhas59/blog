import React, { useCallback } from "react";
import styled from "styled-components";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer";

interface FollowButtonProps {
  userId: number;
  setShowInfo?: React.Dispatch<
    React.SetStateAction<boolean | Record<number, boolean>>
  >;
  setActiveUserOption?: React.Dispatch<React.SetStateAction<string | null>>;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  setShowInfo,
  setActiveUserOption,
}) => {
  const dispatch = useDispatch();
  const me = useSelector((state: RootState) => state.user.me);

  const resetInfoAndOption = useCallback(() => {
    if (setShowInfo) {
      setShowInfo((prev) => (typeof prev === "boolean" ? false : {}));
    }
    if (setActiveUserOption) {
      setActiveUserOption(null);
    }
  }, [setShowInfo, setActiveUserOption]);

  const onFollow = useCallback(() => {
    if (userId === me?.id) return alert("자기 자신은 팔로우할 수 없습니다.");
    dispatch({ type: FOLLOW_REQUEST, data: userId });
    resetInfoAndOption();
    alert("팔로우 완료");
  }, [dispatch, setActiveUserOption, setShowInfo, userId]);

  const onUnFollow = useCallback(() => {
    dispatch({ type: UNFOLLOW_REQUEST, data: userId });
    resetInfoAndOption();
    alert("언팔로우 완료");
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
  font-size: 12px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

export default FollowButton;
