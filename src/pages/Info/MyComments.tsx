import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { CommentType, ReCommentType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import MyCommentListRenderer from "../../components/renderer/MyCommentListRenderer";

const MyComments: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reComments, setReComments] = useState<ReCommentType[]>([]);
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "comment";

  useEffect(() => {
    if (!me) return;

    const getUserComments = async () => {
      try {
        const response = await axios.get(`/post/user/comment?userId=${me.id}`);
        setComments(response.data.comments);
        setReComments(response.data.reComments);
      } catch (error) {
        console.error(error);
      }
    };

    getUserComments();
  }, [me]);

  const onSearch = useCallback(
    (
      id: number,
      type: "comment" | "reComment",
      content: string,
      postId: number
    ) => {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: content,
        searchOption,
        postId,
      });
      const queryParam =
        type === "comment"
          ? `commentId=comment-${id}`
          : `reCommentId=reComment-${id}`;

      navigator(`/searchedPost/${postId}?${queryParam}`);
    },
    [dispatch, navigator, searchOption]
  );

  return (
    <CommentsContainer>
      <Heading>◈내가 쓴 댓글◈</Heading>
      <CommentList>
        <Heading>댓글</Heading>
        <MyCommentListRenderer
          items={comments}
          onItemClick={(id, content, postId) =>
            onSearch(id, "comment", content, postId)
          }
        />
      </CommentList>

      <CommentList>
        <Heading>대댓글</Heading>
        <MyCommentListRenderer
          items={reComments}
          onItemClick={(id, content, postId) =>
            onSearch(id, "reComment", content, postId)
          }
        />
      </CommentList>
    </CommentsContainer>
  );
};

export default MyComments;

const CommentsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const CommentList = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;
