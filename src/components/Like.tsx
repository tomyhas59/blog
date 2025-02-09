import React, { SyntheticEvent, useCallback, useState } from "react";
import styled from "styled-components";
import { Liked } from "./Post";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { LikeType } from "../types";
import { useDispatch } from "react-redux";
import {
  LIKE_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  LIKE_RECOMMENT_REQUEST,
  UNLIKE_COMMENT_REQUEST,
  UNLIKE_POST_REQUEST,
  UNLIKE_RECOMMENT_REQUEST,
} from "../reducer/post";

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
  const id = me?.id;
  const liked = item.Likers?.find((liker: LikeType) => liker.id === me?.id);
  const dispatch = useDispatch();
  const [hearts, setHearts] = useState<{ id: number; isLike: boolean }[]>([]);

  const triggerHeartAnimation = (isLike: boolean) => {
    const newHeart = Date.now();
    setHearts((prev) => [...prev, { id: newHeart, isLike }]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart));
    }, 1000);
  };

  //좋아요 누른 유저-------------------------
  const [showLikers, setShowLikers] = useState(false);

  const handleLike = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (!id) {
        return alert("로그인이 필요합니다");
      }
      if (itemType === "post") {
        dispatch({
          type: LIKE_POST_REQUEST,
          data: item.id,
        });
      } else if (itemType === "comment") {
        dispatch({
          type: LIKE_COMMENT_REQUEST,
          data: item.id,
          isTop3Comments,
        });
      } else if (itemType === "reComment")
        dispatch({
          type: LIKE_RECOMMENT_REQUEST,
          data: {
            commentId,
            reCommentId: item.id,
          },
        });
      triggerHeartAnimation(false);
    },
    [id, itemType, dispatch, commentId, item.id, isTop3Comments]
  );

  const handleUnLike = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!id) {
        return alert("로그인이 필요합니다");
      }
      if (itemType === "post") {
        dispatch({
          type: UNLIKE_POST_REQUEST,
          data: item.id,
        });
      } else if (itemType === "comment") {
        dispatch({
          type: UNLIKE_COMMENT_REQUEST,
          data: item.id,
          isTop3Comments,
        });
      } else if (itemType === "reComment")
        dispatch({
          type: UNLIKE_RECOMMENT_REQUEST,
          data: {
            commentId,
            reCommentId: item.id,
          },
        });
      triggerHeartAnimation(true);
    },
    [id, itemType, dispatch, commentId, item.id, isTop3Comments]
  );

  const handleMouseEnter = () => {
    setShowLikers(true);
  };

  const handleMouseLeave = () => {
    setShowLikers(false);
  };

  return (
    <LikeContainer>
      <Liked>{item.Likers?.length}</Liked>
      {liked ? (
        <LikeButton
          onClick={handleUnLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ♥
        </LikeButton>
      ) : (
        <LikeButton
          onClick={handleLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ♡
        </LikeButton>
      )}

      {hearts.map(({ id, isLike }) => (
        <Heart key={id} isLike={isLike} />
      ))}

      {showLikers && item.Likers?.length > 0 && (
        <LikersList>
          {item.Likers.map((liker: LikeType) => (
            <LikersListItem key={liker.id}>{liker.nickname}</LikersListItem>
          ))}
        </LikersList>
      )}
    </LikeContainer>
  );
};

export default Like;

const LikeContainer = styled.div`
  position: relative;
  margin-left: auto;
`;

const LikeButton = styled.button`
  margin: 2px;
  font-size: 12px;
  color: red;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;
const LikersList = styled.ul`
  position: absolute;
  list-style-type: none;
  padding: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ccc;
  z-index: 99;
`;

const LikersListItem = styled.li`
  width: 50px;
  color: ${(props) => props.theme.mainColor};
`;

const Heart = styled.div<{ isLike: boolean }>`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  color: red;
  animation: ${({ isLike }) => (isLike ? "popUp" : "popDown")} 0.5s ease-out
    forwards;

  &::before {
    content: "💖";
  }

  @keyframes popUp {
    0% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) translateY(-20px) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-40px) scale(1);
    }
  }

  @keyframes popDown {
    0% {
      opacity: 1;
      transform: translateX(-50%) translateY(-40px) scale(1);
    }
    50% {
      transform: translateX(-50%) translateY(-20px) scale(1.2);
    }
    100% {
      opacity: 0;
    }
  }
`;
