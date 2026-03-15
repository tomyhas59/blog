import React, { useCallback } from "react";
import styled from "styled-components";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../../reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { StyledButton } from "../post/PostCommonStyles";

interface FollowButtonProps {
  userId: number;
  setShowAuthorMenu?: React.Dispatch<
    React.SetStateAction<boolean | Record<number, boolean>>
  >;
  setActiveUserOption?: (nickname: string | null) => void;
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
      // window.location.reload(); // 리덕스 상태가 업데이트되면 자동으로 리렌더링되므로 보통은 생략 가능합니다.
    },
    [dispatch, resetInfoAndOption, userId, me?.id],
  );

  if (!me || me.id === userId) return null;

  const isFollowing = me.Followings.some(
    (following) => following.id === userId,
  );

  return (
    <ActionButton isFollowing={isFollowing} onClick={handleFollow(isFollowing)}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </ActionButton>
  );
};

// 기존 StyledButton을 확장해서 디자인만 살짝 변경
const ActionButton = styled(StyledButton)<{ isFollowing: boolean }>`
  background-color: ${(props) =>
    props.isFollowing ? "#f3f4f6" : props.theme.mainColor};
  color: ${(props) =>
    props.isFollowing ? "#ef4444" : "#fff"}; /* 언팔로우는 빨간색 포인트 */
  font-weight: 700;
  text-align: center; /* 메뉴 안에서 가운데 정렬 */

  &:hover {
    background-color: ${(props) =>
      props.isFollowing ? "#fee2e2" : props.theme.subColor};
    color: ${(props) => (props.isFollowing ? "#dc2626" : "#fff")};
  }
`;

export default FollowButton;
