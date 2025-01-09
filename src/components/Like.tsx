import React, { useCallback, useState } from "react";
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
}: {
  itemType: string;
  item: any;
  commentId?: number;
}) => {
  const me = useSelector((state: RootState) => state.user.me);
  const id = me?.id;
  const liked = item.Likers?.find((liker: LikeType) => liker.id === me?.id);
  const dispatch = useDispatch();

  //좋아요 누른 유저-------------------------
  const [showLikers, setShowLikers] = useState(false);

  const onLike = useCallback(() => {
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
      });
    } else if (itemType === "reComment")
      dispatch({
        type: LIKE_RECOMMENT_REQUEST,
        data: {
          commentId,
          reCommentId: item.id,
        },
      });
  }, [dispatch, id, item.id, commentId, itemType]);

  const onUnLike = useCallback(() => {
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
      });
    } else if (itemType === "reComment")
      dispatch({
        type: UNLIKE_RECOMMENT_REQUEST,
        data: {
          commentId,
          reCommentId: item.id,
        },
      });
  }, [dispatch, id, item.id, commentId, itemType]);

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
          onClick={onUnLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ♥
        </LikeButton>
      ) : (
        <LikeButton
          onClick={onLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ♡
        </LikeButton>
      )}
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
  @media (max-width: 480px) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
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
  top: 2rem;
  right: 0;
  list-style-type: none;
  padding: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ccc;
  z-index: 99;
`;

const LikersListItem = styled.li`
  color: ${(props) => props.theme.mainColor};
`;
