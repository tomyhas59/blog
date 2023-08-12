import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ADD_RECOMMENT_REQUEST } from "../reducer/post";
import useInput from "../hooks/useInput";

const ReCommentForm = ({ post, comment }) => {
  const [reComment, onChangeReComment, setReComment] = useInput();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  const onSubmitReComment = useCallback(
    (e) => {
      e.preventDefault();
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
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;
