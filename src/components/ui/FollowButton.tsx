import React, { useCallback } from "react";
import styled from "styled-components";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../../reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer";

interface FollowButtonProps {
  userId: number;
  setShowAuthorMenu?: React.Dispatch<
    React.SetStateAction<boolean | Record<number, boolean>>
  >;
  setActiveUserOption?: React.Dispatch<React.SetStateAction<string | null>>;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  setShowAuthorMenu,
  setActiveUserOption,
}) => {
  const dispatch = useDispatch();
  const me = useSelector((state: RootState) => state.user.me);

  const resetInfoAndOption = useCallback(() => {
    setShowAuthorMenu?.((prev) => (typeof prev === "boolean" ? false : {}));
    setActiveUserOption?.(null);
  }, [setShowAuthorMenu, setActiveUserOption]);

  const handleFollow = useCallback(
    (isFollowing: boolean) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (userId === me?.id) return alert("자기 자신은 팔로우할 수 없습니다.");

      dispatch({
        type: isFollowing ? UNFOLLOW_REQUEST : FOLLOW_REQUEST,
        data: userId,
      });

      resetInfoAndOption();
      alert(isFollowing ? "언팔로우 완료" : "팔로우 완료");
      window.location.reload();
    },
    [dispatch, resetInfoAndOption, userId, me?.id]
  );

  if (!me) return null;

  const isFollowing = me.Followings.some(
    (following) => following.id === userId
  );

  return (
    <Button onClick={handleFollow(isFollowing)}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

export const Button = styled.button`
  background-color: ${({ theme }) => theme.mainColor};
  font-size: 12px;
  min-width: 40px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  z-index: 9999;
`;

export default FollowButton;
