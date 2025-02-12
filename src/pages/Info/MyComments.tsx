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
import { usePagination } from "../../hooks/PaginationProvider";

const MyComments: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reComments, setReComments] = useState<ReCommentType[]>([]);
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "comment";
  const { postNum, commentNum } = useSelector((state: RootState) => state.post);
  const [postId, setPostId] = useState<number | null>(null);
  const [commentOrReCommentId, setCommentOrReCommentId] = useState<
    number | null
  >(null);
  const { divisor, setCurrentPage, setCurrentCommentsPage } = usePagination();
  const [category, setCategory] = useState<string>("");

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

  useEffect(() => {
    const fetchData = async () => {
      if (
        postNum &&
        commentNum &&
        postId !== null &&
        commentOrReCommentId !== null
      ) {
        const searchedPostPage = Math.floor(Number(postNum) / divisor) + 1;
        const searchedCommentPage =
          Math.floor(Number(commentNum) / divisor) + 1;

        setCurrentPage(searchedPostPage);
        setCurrentCommentsPage(searchedCommentPage);

        const queryParam =
          category === "comment"
            ? `commentId=comment-content-${commentOrReCommentId}`
            : `reCommentId=reComment-content-${commentOrReCommentId}`;

        navigator(`/post/${postId}?${queryParam}`);

        dispatch({ type: "RESET_NUM" });
      }
    };

    fetchData();
  }, [
    commentOrReCommentId,
    category,
    dispatch,
    postNum,
    setCurrentPage,
    divisor,
    navigator,
    postId,
    commentNum,
    setCurrentCommentsPage,
  ]);

  const searchByCommentType = useCallback(
    (
      id: number,
      category: "comment" | "reComment",
      content: string,
      postId: number
    ) => {
      setPostId(postId);
      setCommentOrReCommentId(id);
      setCategory(category);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        commentOrReCommentId: id,
        searchText: content,
        searchOption,
        postId,
        category,
      });
    },
    [dispatch, searchOption]
  );

  const [isMyComments, setIsMyComments] = useState(true);

  return (
    <CommentsContainer>
      <Heading>
        <MyCommentsTitle
          isMyComments={isMyComments}
          onClick={() => setIsMyComments(true)}
        >
          내가 쓴 댓글
        </MyCommentsTitle>
        <MyReComments
          isMyComments={isMyComments}
          onClick={() => setIsMyComments(false)}
        >
          내가 쓴 대댓글
        </MyReComments>
      </Heading>
      {isMyComments ? (
        <CommentList>
          <MyCommentListRenderer
            items={comments}
            onItemClick={(id, content, postId) =>
              searchByCommentType(id, "comment", content, postId)
            }
          />
        </CommentList>
      ) : (
        <CommentList>
          <MyCommentListRenderer
            items={reComments}
            onItemClick={(id, content, postId) =>
              searchByCommentType(id, "reComment", content, postId)
            }
          />
        </CommentList>
      )}
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

const Heading = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const MyCommentsTitle = styled.button<{ isMyComments: boolean }>`
  padding: 8px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.isMyComments ? props.theme.mainColor : "transparent"};
  color: ${(props) => (props.isMyComments ? "#fff" : props.theme.textColor)};
  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    color: white;
  }
`;
const MyReComments = styled.button<{ isMyComments: boolean }>`
  padding: 8px;
  border-radius: 10px;
  background-color: ${(props) =>
    !props.isMyComments ? props.theme.mainColor : "transparent"};
  color: ${(props) => (!props.isMyComments ? "#fff" : props.theme.textColor)};
  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    color: white;
  }
`;

const CommentList = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;
