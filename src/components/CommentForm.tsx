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
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducer/post";
import { PostType } from "../types";
import { RootState } from "../reducer";
import useTextareaAutoHeight from "../hooks/useTextareaAutoHeight";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../hooks/PaginationProvider";

const CommentForm = ({
  post,
  setAddComment,
}: {
  post: PostType;
  setAddComment: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const { addCommentDone, totalComments } = useSelector(
    (state: RootState) => state.post
  );
  const [content, , setContent] = useInput();
  const [addedComment, setAddedComment] = useState<boolean>(false);

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const { currentPage, divisor, setCurrentCommentsPage, sortBy } =
    usePagination();

  const editCommentRef = useRef<HTMLTextAreaElement>(null);

  //입력 시 textarea높이 조정
  useTextareaAutoHeight(editCommentRef, null);

  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addCommentDone) {
      setContent("");
    }
    if (editCommentRef.current) {
      editCommentRef.current!.focus();
    }
  }, [addCommentDone, setContent]);

  const location = useLocation();
  const navigator = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptiontParam = params.get("searchOption");

  const setParams = useCallback(
    (number: number) => {
      const params = new URLSearchParams();
      if (searchTextParam) params.set("searchText", searchTextParam);
      if (searchOptiontParam) params.set("searchOption", searchOptiontParam);
      params.set("page", currentPage.toString());
      params.set("sortBy", sortBy);
      params.set("cPage", number.toString());

      const pathname = searchOptiontParam
        ? `/searchedPost/${post.id}`
        : `/post/${post.id}`;

      navigator({ pathname, search: params.toString() });
    },
    [
      currentPage,
      navigator,
      post.id,
      searchOptiontParam,
      searchTextParam,
      sortBy,
    ]
  );

  const onSubmitComment = useCallback(
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

      setAddComment({ [post.id]: false });
      setCurrentCommentsPage(totalCommentPages);
      setParams(totalCommentPages);
      setAddedComment(false);
    }
  }, [
    post.id,
    divisor,
    setAddComment,
    setCurrentCommentsPage,
    setParams,
    totalComments,
    addedComment,
  ]);

  return (
    <CommentFormContainer>
      <Form onSubmit={onSubmitComment}>
        <Textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={onChangeContent}
          ref={editCommentRef}
        />
        <Button type="submit">등록</Button>
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
  text-align: center;
`;

const Textarea = styled.textarea`
  max-width: 90%;
  min-width: 90%;
  width: 77%;
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
