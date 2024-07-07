import React, {
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  useRef,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducer/post";
import { PostType } from "../types";
import { RootState } from "../reducer";

const CommentForm = ({
  post,
  setAddComment,
}: {
  post: PostType;
  setAddComment: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const { addCommentDone } = useSelector((state: RootState) => state.post);
  const [content, , setContent] = useInput();

  const onChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const editCommentRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addCommentDone) {
      setContent("");
    }
    if (editCommentRef) {
      editCommentRef.current!.focus();
    }
  }, [addCommentDone, setContent]);

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
      setAddComment({ [post.id]: false });
    },
    [content, dispatch, id, post.id, setAddComment]
  );

  const onSubmiEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmitComment(e);
    }
  };

  return (
    <CommentWrapper>
      <Form onSubmit={onSubmitComment}>
        <Textarea
          placeholder="Shift+Enter로 줄바꿈"
          value={content}
          onChange={onChangeContent}
          ref={editCommentRef}
          onKeyUp={onSubmiEnterKey}
        />
        <Button type="submit">등록</Button>
      </Form>
    </CommentWrapper>
  );
};

export default CommentForm;

const CommentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.mainColor};
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px;
`;

const Form = styled.form`
  text-align: center;
`;

const Textarea = styled.textarea`
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
