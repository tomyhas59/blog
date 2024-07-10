import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { CommentType, ReCommentType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import ContentRenderer from "../../components/ContentRenderer";

const MyComments: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reComments, setReComments] = useState<ReCommentType[]>([]);
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "all";

  useEffect(() => {
    if (!me) return; // 로그인되어 있지 않으면 처리 중단

    const getUserComments = async () => {
      try {
        const response = await axios.get(`/post/comment?userId=${me.id}`);
        setComments(response.data.comments);
        setReComments(response.data.reComments);
      } catch (error) {
        console.error(error);
      }
    };

    getUserComments();
  }, [me]);

  const onSearch = useCallback(
    (content: string) => {
      navigator("/");
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        query: content,
        searchOption,
      });

      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch]
  );

  return (
    <CommentsContainer>
      <Heading>◈내가 쓴 댓글◈</Heading>
      <CommentList>
        <Heading>댓글</Heading>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                onClick={() => onSearch(comment.content)}
              >
                <ContentRenderer content={comment.content} />
              </CommentItem>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        )}
      </CommentList>

      <CommentList>
        <Heading>대댓글</Heading>
        {reComments.length > 0 ? (
          <ul>
            {reComments.map((reComment) => (
              <CommentItem
                key={reComment.id}
                onClick={() => onSearch(reComment.content)}
              >
                <ContentRenderer content={reComment.content} />
              </CommentItem>
            ))}
          </ul>
        ) : (
          <p>작성한 대댓글이 없습니다.</p>
        )}
      </CommentList>
    </CommentsContainer>
  );
};

export default MyComments;

const CommentsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const CommentList = styled.div`
  margin-bottom: 20px;
`;

const CommentItem = styled.li`
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.mainColor};
  }
`;

const CommentContent = styled.button`
  margin: 0;
  font-size: 16px;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;
`;
