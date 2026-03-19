import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../reducer";
import { CommentType, ReplyType } from "../../../types";
import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import MyCommentListRenderer from "../../../components/renderer/MyCommentListRenderer";
import { usePagination } from "../../../hooks/PaginationProvider";
import * as S from "./MyCommentsStyles";

const MyComments: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [replyPage, setReplyPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [isMyComments, setIsMyComments] = useState(true);

  const { me } = useSelector((state: RootState) => state.user);
  const { postNum, commentNum } = useSelector((state: RootState) => state.post);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const [postId, setPostId] = useState<number | null>(null);
  const [commentOrReplyId, setCommentOrReplyId] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const { divisor, setCurrentPage, setCurrentCommentsPage } = usePagination();

  // 타입별 첫 페이지 로드 로직
  useEffect(() => {
    if (!me) return;
    const getUserCommentsByType = async () => {
      try {
        const type = isMyComments ? "comment" : "reply";
        const response = await axios.get(
          `/post/user/comment?userId=${me.id}&type=${type}`,
        );
        if (isMyComments) {
          setComments(response.data.items);
          setCommentPage(2);
          setHasMoreComments(true);
        } else {
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

  // 다음 페이지 불러오기
  const fetchUserCommentsByType = useCallback(
    async (type: "comment" | "reply") => {
      if (!me) return;
      const page = type === "comment" ? commentPage : replyPage;
      try {
        const response = await axios.get(
          `/post/user/comment?userId=${me.id}&page=${page}&limit=5&type=${type}`,
        );
        const newItems = response.data.items || [];
        const hasMore = response.data.hasMore;

        if (type === "comment") {
          setComments((prev) => [...prev, ...newItems]);
          setHasMoreComments(hasMore);
          setCommentPage((prev) => prev + 1);
        } else {
          setReplies((prev) => [...prev, ...newItems]);
          setHasMoreReplies(hasMore);
          setReplyPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    },
    [me, commentPage, replyPage],
  );

  // 클릭 시 해당 게시글 및 댓글 위치로 이동
  useEffect(() => {
    if (postNum && commentNum && postId !== null && commentOrReplyId !== null) {
      const searchedPostPage = Math.floor(Number(postNum) / divisor) + 1;
      const searchedCommentPage = Math.floor(Number(commentNum) / divisor) + 1;

      setCurrentPage(searchedPostPage);
      setCurrentCommentsPage(searchedCommentPage);

      const queryParam =
        category === "comment"
          ? `commentId=comment-content-${commentOrReplyId}`
          : `replyId=reply-content-${commentOrReplyId}`;

      navigator(`/post/${postId}?${queryParam}`);
      dispatch({ type: "RESET_NUM" });
    }
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

  // 검색 요청 핸들러
  const searchByCommentType = useCallback(
    (
      id: number,
      category: "comment" | "reply",
      content: string,
      postId: number,
    ) => {
      setPostId(postId);
      setCommentOrReplyId(id);
      setCategory(category);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        commentOrReplyId: id,
        searchText: content,
        searchOption: "comment",
        postId,
        category,
      });
    },
    [dispatch],
  );

  const currentItems = isMyComments ? comments : replies;
  const hasMore = isMyComments ? hasMoreComments : hasMoreReplies;

  return (
    <S.Container>
      <S.TabHeader>
        <S.TabButton
          active={isMyComments}
          onClick={() => setIsMyComments(true)}
        >
          <i className="fas fa-comment"></i>
          <span>댓글</span>
          <S.TabCount>{comments.length}</S.TabCount>
        </S.TabButton>
        <S.TabButton
          active={!isMyComments}
          onClick={() => setIsMyComments(false)}
        >
          <i className="fas fa-comments"></i>
          <span>대댓글</span>
          <S.TabCount>{replies.length}</S.TabCount>
        </S.TabButton>
      </S.TabHeader>

      {currentItems.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>
            <i className="far fa-comment-dots"></i>
          </S.EmptyIcon>
          <S.EmptyText>
            {isMyComments
              ? "작성한 댓글이 없습니다"
              : "작성한 대댓글이 없습니다"}
          </S.EmptyText>
        </S.EmptyState>
      ) : (
        <>
          <MyCommentListRenderer
            items={currentItems}
            onItemClick={(id, content, postId) =>
              searchByCommentType(
                id,
                isMyComments ? "comment" : "reply",
                content,
                postId,
              )
            }
            type={isMyComments ? "comment" : "reply"}
          />

          {hasMore && (
            <S.LoadMoreButton
              onClick={() =>
                fetchUserCommentsByType(isMyComments ? "comment" : "reply")
              }
            >
              <i className="fas fa-plus-circle"></i>
              {isMyComments ? "댓글" : "대댓글"} 더 보기
            </S.LoadMoreButton>
          )}
        </>
      )}
    </S.Container>
  );
};

export default MyComments;
