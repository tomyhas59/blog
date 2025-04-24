import React, {
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../../reducer/post";
import { PostType } from "../../types";
import { RootState } from "../../reducer";
import useTextareaAutoHeight from "../../hooks/useTextareaAutoHeight";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/PaginationProvider";

const CommentForm = ({ post }: { post: PostType }) => {
  const { addCommentDone, totalComments } = useSelector(
    (state: RootState) => state.post
  );
  const [content, , setContent] = useInput();
  const [addedComment, setAddedComment] = useState<boolean>(false);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value); //useInput()은 HTMLInputElement라서 HTMLTextAreaElement 따로 만듦
  };
  const { currentPage, divisor, setCurrentCommentsPage, sortBy } =
    usePagination();

  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  //입력 시 textarea높이 조정
  useTextareaAutoHeight(commentTextAreaRef, null);

  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addCommentDone) {
      setContent("");
    }
  }, [addCommentDone, setContent]);

  const location = useLocation();
  const navigator = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptionParam = params.get("searchOption");

  const setParams = useCallback(
    (number: number) => {
      const params = new URLSearchParams();
      if (searchTextParam) params.set("searchText", searchTextParam);
      if (searchOptionParam) params.set("searchOption", searchOptionParam);
      params.set("page", currentPage.toString());
      params.set("sortBy", sortBy);
      params.set("cPage", number.toString());

      const pathname = searchOptionParam
        ? `/searchedPost/${post.id}`
        : `/post/${post.id}`;

      navigator({ pathname, search: params.toString() });
    },
    [
      currentPage,
      navigator,
      post.id,
      searchOptionParam,
      searchTextParam,
      sortBy,
    ]
  );

  const handleAddComment = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (content === "") {
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
    [content, dispatch, id, post.id]
  );

  useEffect(() => {
    if (addedComment) {
      const totalCommentPages = Math.ceil(Number(totalComments) / divisor);
      setCurrentCommentsPage(totalCommentPages);
      setParams(totalCommentPages);
      setAddedComment(false);
    }
  }, [
    post.id,
    divisor,
    setCurrentCommentsPage,
    setParams,
    totalComments,
    addedComment,
  ]);

  const commentPlaceholder = id
    ? "답글을 입력해주세요."
    : "로그인 후 입력 가능합니다.";

  return (
    <CommentFormContainer>
      <Form onSubmit={handleAddComment}>
        <Textarea
          placeholder={commentPlaceholder}
          value={content}
          onChange={handleContentChange}
          ref={commentTextAreaRef}
          disabled={!id}
        />
        <Button type="submit" disabled={!id}>
          등록
        </Button>
      </Form>
    </CommentFormContainer>
  );
};

export default CommentForm;

const CommentFormContainer = styled.div`
  background: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Textarea = styled.textarea`
  max-width: 90%;
  min-width: 90%;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  font-size: 12px;
  margin: 2px;
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
