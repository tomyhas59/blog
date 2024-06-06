import React, { useEffect, useCallback, useRef, SyntheticEvent } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ADD_RECOMMENT_REQUEST } from "../reducer/post";
import useInput from "../hooks/useInput";
import { CommentType, PostType } from "../types";
import { RootState } from "../reducer";

const ReCommentForm = ({
  post,
  comment,
  setAddReComment,
}: {
  post: PostType;
  comment: CommentType;
  setAddReComment: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}) => {
  const { addReCommentDone } = useSelector((state: RootState) => state.post);
  const editReCommentRef = useRef<HTMLInputElement>(null);

  const [reComment, onChangeReComment, setReComment] = useInput();
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addReCommentDone) {
      setReComment("");
    }
    if (editReCommentRef) {
      editReCommentRef.current!.focus();
    }
  }, [addReCommentDone, editReCommentRef, setReComment]);

  const onSubmitReComment = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (reComment === "") {
        alert("댓글을 입력하세요");
        return;
      }

      console.log(comment.id, reComment);
      dispatch({
        type: ADD_RECOMMENT_REQUEST,
        data: {
          content: reComment,
          postId: post.id,
          commentId: comment.id,
          userId: id,
        },
      });
      setAddReComment({ [comment.id]: false });
    },
    [comment.id, reComment, dispatch, post.id, id]
  );

  return (
    <Form onSubmit={onSubmitReComment}>
      <InputComment
        type="text"
        placeholder="ReComment"
        value={reComment}
        onChange={onChangeReComment}
        ref={editReCommentRef}
      />
      <Button type="submit">등록</Button>
    </Form>
  );
};

export default ReCommentForm;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const InputComment = styled.input`
  width: 70%;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  font-size: 12px;
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;
