import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { CommentType, ReplyType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import MyCommentListRenderer from "../../components/renderer/MyCommentListRenderer";
import { usePagination } from "../../hooks/PaginationProvider";
import { MoreButton } from "./MyPosts";

const MyComments: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [replyPage, setReplyPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);

  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "comment";
  const { postNum, commentNum } = useSelector((state: RootState) => state.post);
  const [postId, setPostId] = useState<number | null>(null);
  const [commentOrReplyId, setCommentOrReplyId] = useState<number | null>(null);
  const { divisor, setCurrentPage, setCurrentCommentsPage } = usePagination();
  const [category, setCategory] = useState<string>("");

  const [isMyComments, setIsMyComments] = useState(true);

  useEffect(() => {
    if (!me) return;

    const getUserCommentsByType = async () => {
      try {
        // 댓글 1페이지 불러오기
        if (isMyComments) {
          const response = await axios.get(
            `/post/user/comment?userId=${me.id}&type=comment`
          );
          setComments(response.data.items);
          setCommentPage(2);
          setHasMoreComments(true);
        } else {
          const response = await axios.get(
            `/post/user/comment?userId=${me.id}&type=reply`
          );
          setReplies(response.data.items);
          setReplyPage(2);
          setHasMoreReplies(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserCommentsByType();
  }, [isMyComments, me]);

  // 다음 페이지 댓글 불러오기
  const fetchUserCommentsByType = useCallback(
    async (type: "comment" | "reply") => {
      if (!me) return;

      const page = type === "comment" ? commentPage : replyPage;

      try {
        const response = await axios.get(
          `/post/user/comment?userId=${me.id}&page=${page}&limit=5&type=${type}`
        );

        const newItems = response.data.items || [];
        const hasMore = response.data.hasMore;

        if (type === "comment") {
          setComments((prev) =>
            Array.isArray(prev) ? [...prev, ...newItems] : [...newItems]
          );
          setHasMoreComments(hasMore);
          setCommentPage((prev) => prev + 1);
        } else {
          setReplies((prev) =>
            Array.isArray(prev) ? [...prev, ...newItems] : [...newItems]
          );
          setHasMoreReplies(hasMore);
          setReplyPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    },
    [me, commentPage, replyPage]
  );

  //불러온 댓글 클릭 시 페이지 이동
  useEffect(() => {
    const fetchData = async () => {
      if (
        postNum &&
        commentNum &&
        postId !== null &&
        commentOrReplyId !== null
      ) {
        const searchedPostPage = Math.floor(Number(postNum) / divisor) + 1;
        const searchedCommentPage =
          Math.floor(Number(commentNum) / divisor) + 1;

        setCurrentPage(searchedPostPage);
        setCurrentCommentsPage(searchedCommentPage);

        const queryParam =
          category === "comment"
            ? `commentId=comment-content-${commentOrReplyId}`
            : `replyId=reply-content-${commentOrReplyId}`;

        navigator(`/post/${postId}?${queryParam}`);

        dispatch({ type: "RESET_NUM" });
      }
    };

    fetchData();
  }, [
    commentOrReplyId,
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
      category: "comment" | "reply",
      content: string,
      postId: number
    ) => {
      setPostId(postId);
      setCommentOrReplyId(id);
      setCategory(category);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        commentOrReplyId: id,
        searchText: content,
        searchOption,
        postId,
        category,
      });
    },
    [dispatch, searchOption]
  );

  return (
    <CommentsContainer>
      <Heading>
        <MyCommentsTitle
          isMyComments={isMyComments}
          onClick={() => setIsMyComments(true)}
        >
          내가 쓴 댓글
        </MyCommentsTitle>
        <MyReplies
          isMyComments={isMyComments}
          onClick={() => setIsMyComments(false)}
        >
          내가 쓴 대댓글
        </MyReplies>
      </Heading>
      {isMyComments ? (
        <CommentList>
          <MyCommentListRenderer
            items={comments}
            onItemClick={(id, content, postId) =>
              searchByCommentType(id, "comment", content, postId)
            }
            type="comment"
          />
          {hasMoreComments && (
            <MoreButton onClick={() => fetchUserCommentsByType("comment")}>
              더 보기
            </MoreButton>
          )}
        </CommentList>
      ) : (
        <CommentList>
          <MyCommentListRenderer
            items={replies}
            onItemClick={(id, content, postId) =>
              searchByCommentType(id, "reply", content, postId)
            }
            type="reply"
          />
          {hasMoreReplies && (
            <MoreButton onClick={() => fetchUserCommentsByType("reply")}>
              더 보기
            </MoreButton>
          )}
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

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Heading = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
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
const MyReplies = styled.button<{ isMyComments: boolean }>`
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

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;
