import React, { SyntheticEvent, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { LikeType } from "../../types";
import {
  LIKE_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  LIKE_REPLY_REQUEST,
  UNLIKE_COMMENT_REQUEST,
  UNLIKE_POST_REQUEST,
  UNLIKE_REPLY_REQUEST,
} from "../../reducer/post";

const Like = ({
  itemType,
  item,
  commentId,
  isTop3Comments,
}: {
  itemType: string;
  item: any;
  commentId?: number;
  isTop3Comments?: boolean;
}) => {
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();
  const id = me?.id;
  const liked = item.Likers?.find((liker: LikeType) => liker.id === id);

  const [hearts, setHearts] = useState<{ id: number; isLike: boolean }[]>([]);
  const [showLikers, setShowLikers] = useState(false);

  const triggerHeartAnimation = (isLike: boolean) => {
    const newHeart = Date.now();
    setHearts((prev) => [...prev, { id: newHeart, isLike }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart));
    }, 1000);
  };

  const handleLikeToggle = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!id) return alert("로그인이 필요합니다");

      const isPost = itemType === "post";
      const isComment = itemType === "comment";

      const type = liked
        ? isPost
          ? UNLIKE_POST_REQUEST
          : isComment
            ? UNLIKE_COMMENT_REQUEST
            : UNLIKE_REPLY_REQUEST
        : isPost
          ? LIKE_POST_REQUEST
          : isComment
            ? LIKE_COMMENT_REQUEST
            : LIKE_REPLY_REQUEST;

      const data =
        itemType === "reply" ? { commentId, replyId: item.id } : item.id;

      dispatch({ type, data, isTop3Comments });
      triggerHeartAnimation(!liked);
    },
    [id, itemType, dispatch, commentId, item.id, isTop3Comments, liked],
  );

  return (
    <LikeWrapper>
      <LikeContainer
        onMouseEnter={() => setShowLikers(true)}
        onMouseLeave={() => setShowLikers(false)}
        onClick={handleLikeToggle}
        isLiked={!!liked}
      >
        <span className="heart-icon">{liked ? "❤️" : "🤍"}</span>
        <span className="like-count">{item.Likers?.length || 0}</span>

        {hearts.map(({ id, isLike }) => (
          <FloatingHeart key={id} isLike={isLike}>
            💖
          </FloatingHeart>
        ))}
      </LikeContainer>

      {showLikers && item.Likers?.length > 0 && (
        <LikersTooltip>
          <div className="tooltip-title">좋아요 한 사람</div>
          {item.Likers.slice(0, 10).map((liker: LikeType) => (
            <div key={liker.id} className="liker-name">
              {liker.nickname}
            </div>
          ))}
          {item.Likers.length > 10 && (
            <div className="more">외 {item.Likers.length - 10}명</div>
          )}
        </LikersTooltip>
      )}
    </LikeWrapper>
  );
};

export default Like;

/** --- Animations --- **/
const popUp = keyframes`
  0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
  50% { opacity: 1; transform: translate(-50%, -30px) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -60px) scale(1); }
`;

/** --- Styled Components --- **/
const LikeWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const LikeContainer = styled.div<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${(props) => (props.isLiked ? "#fff1f2" : "#f3f4f6")};
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: ${(props) => (props.isLiked ? "#ffe4e6" : "#e5e7eb")};
    transform: scale(1.05);
  }

  .heart-icon {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .like-count {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => (props.isLiked ? "#e11d48" : "#4b5563")};
  }
`;

const FloatingHeart = styled.div<{ isLike: boolean }>`
  position: absolute;
  left: 50%;
  top: 0;
  pointer-events: none;
  font-size: 20px;
  animation: ${popUp} 0.8s ease-out forwards;
`;

const LikersTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  background: #1f2937;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 11px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;

  .tooltip-title {
    border-bottom: 1px solid #374151;
    margin-bottom: 6px;
    padding-bottom: 4px;
    font-weight: 800;
    color: #9ca3af;
  }

  .liker-name {
    margin: 2px 0;
  }

  .more {
    opacity: 0.6;
    margin-top: 4px;
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #1f2937 transparent transparent transparent;
  }
`;
