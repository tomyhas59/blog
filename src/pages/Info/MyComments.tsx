import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { CommentType, ReCommentType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import ListRenderer from "../../components/renderer/ListRenderer";

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
    [dispatch, navigator, searchOption]
  );

  return (
    <CommentsContainer>
      <Heading>◈내가 쓴 댓글◈</Heading>
      <CommentList>
        <Heading>댓글</Heading>
        <ListRenderer
          items={comments}
          onItemClick={(content) => onSearch(content)}
        />
      </CommentList>

      <CommentList>
        <Heading>대댓글</Heading>
        <ListRenderer
          items={reComments}
          onItemClick={(content) => onSearch(content)}
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
