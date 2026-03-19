import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  GET_COMMENTS_REQUEST,
  REMOVE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../../../reducer/post";
import { PostType } from "../../../types";
import { RootState } from "../../../reducer";
import { baseURL } from "../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../pages/Info/MyInfo";
import { formatDate } from "../../../utils/date";

import useInput from "../../../hooks/useInput";
import useOutsideClick from "../../../hooks/useOutsideClick";
import useTextareaAutoHeight from "../../../hooks/useTextareaAutoHeight";
import useSetParams from "../../../hooks/useSetParams";
import { usePagination } from "../../../hooks/PaginationProvider";

import Spinner from "../../ui/Spinner";
import ContentRenderer from "../../renderer/ContentRenderer";
import FollowButton from "../../ui/FollowButton";
import Like from "../../ui/Like";
import CommentPagination from "../../pagination/CommentPagination";
import ReplyForm from "../ReplyForm";
import Reply from "../Reply";
import Top3Comment from "../Top3Comment";
import UserPageButton from "../../ui/UserPageButton";

import * as S from "./CommentStyles";

const Comment = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigator = useNavigate();

  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const {
    removeCommentLoading,
    updateCommentLoading,
    addReplyLoading,
    comments,
    commentsCount,
    newCommentId,
    getCommentsDone,
  } = useSelector((state: RootState) => state.post);

  const {
    setSearchedCurrentPage,
    currentPage,
    currentCommentsPage,
    setCurrentCommentsPage,
    divisor,
    sortBy,
  } = usePagination();

  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const authorMenuRef = useRef<HTMLDivElement>(null);
  const replyFormRef = useRef<HTMLDivElement>(null);
  const editCommentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  // 1. 닉네임 클릭 메뉴 로직 (원본 유지)
  const [showAuthorMenu, setShowAuthorMenu] = useState<Record<number, boolean>>(
    {},
  );
  const toggleShowAuthorMenu = useCallback((commentId: number) => {
    setShowAuthorMenu((prev) => {
      const updated: Record<number, boolean> = {};
      updated[commentId] = !prev[commentId];
      return updated;
    });
  }, []);

  const setParamsHook = useSetParams({ searchOption: "author", page: 1 });
  const searchByNickname = useCallback(
    (userNickname: string) => {
      setSearchedCurrentPage(1);
      setParamsHook({ searchText: userNickname });
      setShowAuthorMenu({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [setSearchedCurrentPage, setParamsHook],
  );

  // 2. 댓글 수정 로직 (원본 유지)
  const [editComment, setEditComment] = useState<Record<number, boolean>>({});
  const [content, , setContent] = useInput();
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  const handleEditClick = useCallback(
    (commentId: number, commentContent: string) => {
      if (currentCommentId !== null)
        setEditComment((prev) => ({ ...prev, [currentCommentId]: false }));
      setCurrentCommentId(commentId);
      setEditComment((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
      setContent(commentContent);
    },
    [currentCommentId, setContent],
  );

  useTextareaAutoHeight(editCommentTextAreaRef, editComment);

  const handleCancelEdit = () => {
    setEditComment({});
    setCurrentCommentId(null);
    setContent("");
  };

  const handleEditComment = useCallback(
    (commentId: number) => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId,
          content: content.replace(/\n/g, "<br>"),
        },
      });
      handleCancelEdit();
    },
    [content, dispatch, post.id, handleCancelEdit],
  );

  const prevContent = content.replace(/<br\s*\/?>/gi, "\n");

  // 3. 대댓글 및 삭제 (원본 유지)
  const [addReply, setAddReply] = useState<Record<string, boolean>>({});
  const showReplyForm = useCallback((commentId: number) => {
    setAddReply((prev) => ({ [commentId]: !prev[commentId] }));
  }, []);

  const handleRemoveComment = useCallback(
    (commentId: number) => {
      if (!window.confirm("삭제하시겠습니까?")) return;
      dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: { commentId, postId: post.id },
      });
    },
    [dispatch, post.id],
  );

  useOutsideClick([authorMenuRef, replyFormRef], () => {
    setShowAuthorMenu({});
    setAddReply({});
  });

  // 4. 스크롤 및 하이라이트 로직 (원본 유지)
  const activeColorRef = useRef(theme.activeColor);
  const backgroundColorRef = useRef(theme.backgroundColor);
  useEffect(() => {
    activeColorRef.current = theme.activeColor;
    backgroundColorRef.current = theme.backgroundColor;
  }, [theme.activeColor, theme.backgroundColor]);

  const scrollToElement = useCallback((commentId: string) => {
    const element =
      document.getElementById(`comment-${commentId}`) ||
      (document.querySelector(
        `[data-comment-id="${commentId}"]`,
      ) as HTMLElement);
    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "center" });
      element.style.backgroundColor = activeColorRef.current;
      setTimeout(() => {
        element.style.backgroundColor = backgroundColorRef.current;
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const cPageParam = params.get("cPage");
    if (cPageParam) setCurrentCommentsPage(Number(cPageParam));
  }, [location.search, setCurrentCommentsPage, params]);

  useEffect(() => {
    if (newCommentId && getCommentsDone) scrollToElement(newCommentId);
  }, [getCommentsDone, newCommentId, scrollToElement]);

  useEffect(() => {
    const targetId = params.get("commentId");
    if (targetId && getCommentsDone) scrollToElement(targetId);
  }, [params, scrollToElement, getCommentsDone]);

  // 5. 데이터 요청 및 페이지 강제 보정 로직 (원본 유지 - 핵심)
  useEffect(() => {
    dispatch({
      type: GET_COMMENTS_REQUEST,
      page: currentCommentsPage,
      postId: post.id,
    });
  }, [currentCommentsPage, dispatch, newCommentId, post.id]);

  const totalCommentPagesCount = Math.ceil(Number(commentsCount) / divisor);

  useEffect(() => {
    const updateURLWithParams = (number: number) => {
      const p = new URLSearchParams(location.search);
      const hashtag = p.get("hashtagName");
      const searchT = p.get("searchText");
      const searchO = p.get("searchOption");
      let pathname;

      if (hashtag) {
        pathname = `/hashtagPost/${post.id}`;
      } else {
        if (searchT) p.set("searchText", searchT);
        if (searchO) p.set("searchOption", searchO);
        p.set("sortBy", sortBy);
        pathname = searchO ? `/searchedPost/${post.id}` : `/post/${post.id}`;
      }
      p.set("page", currentPage.toString());
      p.set("cPage", number.toString());

      navigator({ pathname, search: p.toString() });
    };

    if (
      totalCommentPagesCount > 0 &&
      totalCommentPagesCount < currentCommentsPage
    ) {
      setCurrentCommentsPage(totalCommentPagesCount);
      updateURLWithParams(totalCommentPagesCount);
    }
  }, [
    currentCommentsPage,
    currentPage,
    navigator,
    post.id,
    setCurrentCommentsPage,
    sortBy,
    totalCommentPagesCount,
    location.search,
  ]);

  return (
    <S.CommentContainer ref={scrollTargetRef}>
      {(removeCommentLoading || updateCommentLoading || addReplyLoading) && (
        <Spinner />
      )}
      <Top3Comment />

      {comments?.map((comment) => {
        const isEditing = editComment[comment.id];
        return (
          <S.CommentItem
            key={comment.id}
            id={`comment-${comment.id}`}
            data-comment-id={comment.id}
            isTop3Comments={false}
          >
            <S.CommentHeader>
              <S.AuthorWrapper onClick={() => toggleShowAuthorMenu(comment.id)}>
                <img
                  src={
                    comment.User.Image
                      ? `${baseURL}/${comment.User.Image.src}`
                      : DEFAULT_PROFILE_IMAGE
                  }
                  alt="profile"
                />
                <span>{comment.User.nickname.slice(0, 5)}</span>
              </S.AuthorWrapper>

              {showAuthorMenu[comment.id] && (
                <S.DropdownMenu ref={authorMenuRef}>
                  <S.PrimaryBtn
                    onClick={() => searchByNickname(comment.User.nickname)}
                  >
                    작성 글 보기
                  </S.PrimaryBtn>
                  <UserPageButton userId={comment.UserId} />
                  {id !== comment.User.id && (
                    <FollowButton
                      userId={comment.User.id}
                      setShowAuthorMenu={setShowAuthorMenu as any}
                    />
                  )}
                </S.DropdownMenu>
              )}

              <S.TimeStamp>{formatDate(comment.createdAt)}</S.TimeStamp>
              <Like itemType="comment" item={comment} />
            </S.CommentHeader>

            <S.ContentBox>
              {isEditing && currentCommentId === comment.id ? (
                <>
                  <S.EditArea
                    ref={editCommentTextAreaRef}
                    value={prevContent}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <S.ControlBar style={{ justifyContent: "center" }}>
                    <S.PrimaryBtn onClick={() => handleEditComment(comment.id)}>
                      수정
                    </S.PrimaryBtn>
                    <S.PrimaryBtn onClick={handleCancelEdit}>취소</S.PrimaryBtn>
                  </S.ControlBar>
                </>
              ) : (
                <S.CommentBody id={`comment-content-${comment.id}`}>
                  <ContentRenderer content={comment.content} />
                </S.CommentBody>
              )}

              <S.ControlBar>
                {id && (
                  <S.ActionBtn onClick={() => showReplyForm(comment.id)}>
                    <FontAwesomeIcon icon={faComment} /> 답글
                  </S.ActionBtn>
                )}
                {(id === comment.User.id || nickname === "admin") && (
                  <>
                    <S.ActionBtn
                      onClick={() =>
                        handleEditClick(comment.id, comment.content)
                      }
                    >
                      <FontAwesomeIcon icon={faPen} /> 수정
                    </S.ActionBtn>
                    <S.ActionBtn
                      colorType="sub"
                      onClick={() => handleRemoveComment(comment.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> 삭제
                    </S.ActionBtn>
                  </>
                )}
              </S.ControlBar>
            </S.ContentBox>

            {addReply[comment.id] && (
              <div ref={replyFormRef}>
                <ReplyForm
                  post={post}
                  comment={comment}
                  reply={null}
                  setAddReply={setAddReply}
                />
              </div>
            )}
            <Reply post={post} comment={comment} />
          </S.CommentItem>
        );
      })}

      <CommentPagination
        post={post}
        totalCommentPagesCount={totalCommentPagesCount}
        scrollTargetRef={scrollTargetRef}
      />
    </S.CommentContainer>
  );
};

export default Comment;
