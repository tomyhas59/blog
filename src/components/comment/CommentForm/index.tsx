import React, {
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// Reducer & Types
import { ADD_COMMENT_REQUEST } from "../../../reducer/post";
import { PostType } from "../../../types";
import { RootState } from "../../../reducer";

// Hooks
import useInput from "../../../hooks/useInput";
import useTextareaAutoHeight from "../../../hooks/useTextareaAutoHeight";
import { usePagination } from "../../../hooks/PaginationProvider";

// Styles
import * as S from "./CommentFormStyles";

const CommentForm = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigator = useNavigate();

  // --- Global State ---
  const id = useSelector((state: RootState) => state.user.me?.id);
  const { addCommentDone, totalCommentsCount } = useSelector(
    (state: RootState) => state.post,
  );

  // --- Pagination Context (기존 프롭스/변수 유지) ---
  const { currentPage, divisor, setCurrentCommentsPage, sortBy } =
    usePagination();

  // --- Local State & Refs ---
  const [content, , setContent] = useInput();
  const [addedComment, setAddedComment] = useState<boolean>(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // --- Handlers ---
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 높이 자동 조절 훅 유지
  useTextareaAutoHeight(editorRef, null);

  // --- URL & Navigation Logic (기존 로직 보존) ---
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptionParam = params.get("searchOption");

  const updatePathWithPage = useCallback(
    (targetPage: number) => {
      const newParams = new URLSearchParams();
      if (searchTextParam) newParams.set("searchText", searchTextParam);
      if (searchOptionParam) newParams.set("searchOption", searchOptionParam);

      newParams.set("page", currentPage.toString());
      newParams.set("sortBy", sortBy);
      newParams.set("cPage", targetPage.toString());

      const pathname = searchOptionParam
        ? `/searchedPost/${post.id}`
        : `/post/${post.id}`;

      navigator({ pathname, search: newParams.toString() });
    },
    [
      currentPage,
      navigator,
      post.id,
      searchOptionParam,
      searchTextParam,
      sortBy,
    ],
  );

  // --- Submit Logic (기존 로직 보존) ---
  const onFormSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!content.trim()) {
        alert("댓글을 입력하세요");
        return;
      }
      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: { content: contentWithBreaks, postId: post.id, userId: id },
      });

      setAddedComment(true);
    },
    [content, dispatch, id, post.id],
  );

  // 댓글 등록 완료 처리
  useEffect(() => {
    if (addCommentDone) {
      setContent("");
    }
  }, [addCommentDone, setContent]);

  // 등록 후 마지막 페이지 이동 로직 유지
  useEffect(() => {
    if (addedComment) {
      const totalPages = Math.ceil(Number(totalCommentsCount) / divisor);
      setCurrentCommentsPage(totalPages);
      updatePathWithPage(totalPages);
      setAddedComment(false);
    }
  }, [
    totalCommentsCount,
    divisor,
    setCurrentCommentsPage,
    updatePathWithPage,
    addedComment,
  ]);

  const placeholderText = id
    ? "댓글을 입력해주세요."
    : "로그인 후 입력 가능합니다.";

  return (
    <S.FormWrapper>
      <S.InputComposeArea onSubmit={onFormSubmit}>
        <S.EditorField
          placeholder={placeholderText}
          value={content}
          onChange={handleContentChange}
          ref={editorRef}
          disabled={!id}
        />
        <S.ActionRow>
          <S.SubmitButton type="submit" disabled={!id || !content.trim()}>
            등록
          </S.SubmitButton>
        </S.ActionRow>
      </S.InputComposeArea>
    </S.FormWrapper>
  );
};

export default CommentForm;
