import React, { useEffect, useCallback, SyntheticEvent } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducer/post";
import { PostType } from "../types";
import { RootState } from "../reducer";

const CommentForm = ({
  post,
  editCommentRef,
  setAddComment,
}: {
  post: PostType;
  editCommentRef: React.RefObject<HTMLInputElement>;
  setAddComment: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const { addCommentDone } = useSelector((state: RootState) => state.post);
  const [comment, onChangeComment, setComment] = useInput();
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addCommentDone) {
      setComment("");
    }
    if (editCommentRef) {
      editCommentRef.current!.focus();
    }
  }, [addCommentDone, editCommentRef, setComment]);

  const onSubmitComment = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (comment === "") {
        alert("댓글을 입력하세요");
        return;
      }
      console.log(post.id, comment);
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: { content: comment, postId: post.id, userId: id },
      });
      setAddComment({ [post.id]: false });
    },
    [comment, dispatch, id, post.id]
  );

  return (
    <CommentWrapper>
      <Form onSubmit={onSubmitComment}>
        <InputComment
          type="text"
          placeholder="Comment"
          value={comment}
          onChange={onChangeComment}
          ref={editCommentRef}
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

const InputComment = styled.input`
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
