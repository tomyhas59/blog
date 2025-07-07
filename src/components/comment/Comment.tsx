import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_COMMENTS_REQUEST,
  REMOVE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../../reducer/post";
import useInput from "../../hooks/useInput";
import ReplyForm from "./ReplyForm";
import Reply from "./Reply";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PostType } from "../../types";
import { RootState } from "../../reducer";
import Spinner from "../ui/Spinner";
import ContentRenderer from "../renderer/ContentRenderer";
import useOutsideClick from "../../hooks/useOutsideClick";
import useTextareaAutoHeight from "../../hooks/useTextareaAutoHeight";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../pages/Info/MyInfo";
import FollowButton from "../ui/FollowButton";
import { usePagination } from "../../hooks/PaginationProvider";
import useSetParams from "../../hooks/useSetParams";
import Like from "../ui/Like";
import CommentPagination from "../pagination/CommentPagination";
import { useLocation, useNavigate } from "react-router-dom";
import Top3Comment from "./Top3Comment";
import UserPageButton from "../ui/UserPageButton";
import { formatDate } from "../../utils/date";

const Comment = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
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

  //댓글 페이지 이동 시 스크롤 조정
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigator = useNavigate();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showAuthorMenu, setShowAuthorMenu] = useState<Record<number, boolean>>(
    {}
  );

  const toggleShowAuthorMenu = useCallback((commentId: number) => {
    setShowAuthorMenu((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[commentId] = !prev[commentId];
      return updatedPopupState;
    });
  }, []);

  const setParams = useSetParams({
    searchOption: "author",
    page: 1,
  });

  const searchByNickname = useCallback(
    (userNickname: string) => {
      setSearchedCurrentPage(1);
      setParams({ searchText: userNickname });
      setShowAuthorMenu({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [setSearchedCurrentPage, setParams]
  );
  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState<Record<number, boolean>>({});
  const [content, , setContent] = useInput();

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const editCommentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  const handleEditClick = useCallback(
    (commentId: number, commentContent: string) => {
      // 기존 댓글 닫기
      if (currentCommentId !== null) {
        setEditComment((prev) => ({
          ...prev,
          [currentCommentId]: false,
        }));
      }
      // 현재 열려 있는 댓글의 id 설정
      setCurrentCommentId(commentId);

      setEditComment((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setContent(commentContent);
    },
    [currentCommentId, setContent]
  );

  //수정 시 높이 조정
  useTextareaAutoHeight(editCommentTextAreaRef, editComment);

  // "취소" 버튼을 누를 때 호출되는 함수
  const handleCancelEdit = () => {
    setEditComment({});
    setCurrentCommentId(null);
    setContent(""); // "Text" 영역 초기화
  };

  const handleEditComment = useCallback(
    (commentId: number) => {
      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId: commentId,
          content: contentWithBreaks,
        },
      });
      setEditComment({});
      setCurrentCommentId(null);
      setContent(""); // "Text" 영역 초기화
    },
    [content, dispatch, post.id, setContent]
  );

  const prevContent = content.replace(/<br\s*\/?>/gi, "\n");

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReply, setAddReply] = useState<Record<string, boolean>>({});

  const showReplyForm = useCallback((commentId: number) => {
    setAddReply((prev) => {
      const newReplyState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newReplyState[key] = false;
      });
      newReplyState[commentId] = !prev[commentId];
      return newReplyState;
    });
  }, []);

  //---댓글 삭제-----------------------------------------------------
  const handleRemoveComment = useCallback(
    (commentId: number) => {
      if (!window.confirm("삭제하시겠습니까?")) return false;
      dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: {
          commentId: commentId,
          postId: post.id,
        },
      });
    },
    [dispatch, post.id]
  );

  //OutsideClick----------------------------------------------
  const authorMenuRef = useRef<HTMLDivElement>(null);
  const replyFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef, replyFormRef], () => {
    setShowAuthorMenu({});
    setAddReply({});
  });

  const theme = useTheme();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const commentsPageParam = params.get("cPage");
    if (commentsPageParam) setCurrentCommentsPage(Number(commentsPageParam));
  }, [location.search, setCurrentCommentsPage]);
  //islint 방지용 ref
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
        `[data-comment-id="${commentId}"]`
      ) as HTMLElement) ||
      null;

    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "center" });
      element.style.backgroundColor = activeColorRef.current;
      setTimeout(() => {
        element.style.backgroundColor = backgroundColorRef.current;
      }, 2000);
    }
  }, []);

  // 새 댓글 등록 시 마지막 댓글로 이동
  useEffect(() => {
    if (newCommentId && getCommentsDone) {
      scrollToElement(newCommentId);
    }
  }, [getCommentsDone, newCommentId, scrollToElement]);

  // URL 파라미터로 타겟 댓글로 이동
  useEffect(() => {
    const targetCommentId = params.get("commentId");
    if (targetCommentId) {
      scrollToElement(targetCommentId);
    }
  }, [params, scrollToElement, getCommentsDone]);

  useEffect(() => {
    dispatch({
      type: GET_COMMENTS_REQUEST,
      page: currentCommentsPage,
      postId: post.id,
    });
  }, [currentCommentsPage, dispatch, newCommentId, post.id]);

  const totalCommentPagesCount = Math.ceil(Number(commentsCount) / divisor);

  useEffect(() => {
    const setParams = (number: number) => {
      const params = new URLSearchParams(location.search);
      const hashtagNameParam = params.get("hashtagName");
      const searchTextParam = params.get("searchText");
      const searchOptionParam = params.get("searchOption");
      let pathname;

      //hashtag 있으면 해시태그 페이지
      if (hashtagNameParam) {
        params.set("hashtagName", hashtagNameParam);
        pathname = `/hashtagPost/${post.id}`;
      } else {
        if (searchTextParam) params.set("searchText", searchTextParam);
        if (searchOptionParam) params.set("searchOption", searchOptionParam);
        params.set("sortBy", sortBy);
        pathname = searchOptionParam
          ? `/searchedPost/${post.id}`
          : `/post/${post.id}`;
      }
      params.set("page", currentPage.toString());
      params.set("cPage", number.toString());

      navigator({
        pathname,
        search: params.toString(),
      });
    };
    if (
      totalCommentPagesCount > 0 &&
      totalCommentPagesCount < currentCommentsPage
    ) {
      setCurrentCommentsPage(totalCommentPagesCount);
      setParams(totalCommentPagesCount);
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
    <CommentContainer ref={scrollTargetRef}>
      {(removeCommentLoading || updateCommentLoading || addReplyLoading) && (
        <Spinner />
      )}
      <Top3Comment />
      {comments?.map((comment) => {
        const isEditing = editComment[comment.id];
        return (
          <CommentItem
            isTop3Comments={false}
            key={comment.id}
            id={`comment-${comment.id}`}
            data-comment-id={comment.id}
          >
            <CommentHeader>
              <Author onClick={() => toggleShowAuthorMenu(comment.id)}>
                <img
                  src={
                    comment.User.Image
                      ? `${baseURL}/${comment.User.Image.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="유저 이미지"
                />
                <span>{comment.User.nickname.slice(0, 5)}</span>
              </Author>
              {showAuthorMenu[comment.id] ? (
                <AuthorMenu ref={authorMenuRef}>
                  <BlueButton
                    onClick={() => searchByNickname(comment.User.nickname)}
                  >
                    작성 글 보기
                  </BlueButton>
                  <UserPageButton userId={comment.UserId} />
                  {id !== comment.User.id && (
                    <FollowButton
                      userId={comment.User.id}
                      setShowAuthorMenu={
                        setShowAuthorMenu as React.Dispatch<
                          React.SetStateAction<
                            boolean | Record<number, boolean>
                          >
                        >
                      }
                    />
                  )}
                </AuthorMenu>
              ) : null}
              <Date>{formatDate(comment.createdAt)}</Date>
              <Like itemType="comment" item={comment} />
            </CommentHeader>
            <ContentWrapper>
              {isEditing && currentCommentId === comment.id ? (
                <Textarea
                  value={prevContent}
                  onChange={handleContentChange}
                  ref={editCommentTextAreaRef}
                />
              ) : (
                <Content id={`comment-content-${comment.id}`}>
                  <ContentRenderer content={comment.content} />
                </Content>
              )}
              {isEditing && currentCommentId === comment.id && (
                <ButtonGroup>
                  <BlueButton onClick={() => handleEditComment(comment.id)}>
                    수정
                  </BlueButton>
                  <BlueButton onClick={handleCancelEdit}>취소</BlueButton>
                </ButtonGroup>
              )}
              <CommentOptions>
                {id && (
                  <Button onClick={() => showReplyForm(comment.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </Button>
                )}
                {id === comment.User.id || nickname === "admin" ? (
                  <>
                    <Button
                      onClick={() =>
                        handleEditClick(comment.id, comment.content)
                      }
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <Button onClick={() => handleRemoveComment(comment.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </>
                ) : null}
              </CommentOptions>
            </ContentWrapper>
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
          </CommentItem>
        );
      })}
      <CommentPagination
        post={post}
        totalCommentPagesCount={totalCommentPagesCount}
        scrollTargetRef={scrollTargetRef}
      />
    </CommentContainer>
  );
};

export default Comment;

const CommentContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const CommentItem = styled.div<{ isTop3Comments: boolean }>`
  border-top: 1px solid silver;
  font-size: 15px;
  background-color: ${(props) =>
    props.isTop3Comments ? props.theme.top3Color : "none"};
  transition: all 1s ease-in-out;
  padding: 10px;
`;

export const CommentHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

export const AuthorMenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 30px;
  left: 50px;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  z-index: 999;
`;

export const Author = styled.button`
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
  color: ${(props) => props.theme.textColor};
  transition: transform 0.3s ease, color 0.3s ease;
  img {
    display: inline;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }

  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
`;

export const Content = styled.div`
  width: 90%;
  font-size: 0.8rem;
  display: flex;
`;

const Textarea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  margin: 0 auto;
  padding: 12px;
  font-size: 0.8rem;
`;

const ButtonGroup = styled.div`
  height: 30px;
  text-align: center;
`;
const CommentOptions = styled.div`
  display: flex;

  height: 30px;
  justify-content: flex-end;
  & * {
    margin-left: 2px;
  }
`;

const Button = styled.button`
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.hoverMainColor};
  }
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const Date = styled.span`
  color: gray;
  font-size: 12px;
  @media (max-width: 768px) {
    width: 20%;
  }
`;

export const BlueButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  font-size: 12px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
