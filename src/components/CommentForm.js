import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducer/post";

const CommentForm = ({ post, editCommentRef }) => {
  const { addCommentDone } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
    if (editCommentRef) {
      editCommentRef.current.focus();
    }
  }, [addCommentDone, editCommentRef, setCommentText]);

  const onSubmitComment = useCallback(
    (e) => {
      e.preventDefault();
      console.log(post.id, commentText);
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: { content: commentText, postId: post.id, userId: id },
      });
    },
    [commentText, dispatch, id, post.id]
  );

  return (
    <CommentWrapper>
      <Form onSubmit={onSubmitComment}>
        <InputComment
          type="text"
          placeholder="Comment"
          value={commentText}
          onChange={onChangeCommentText}
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
  padding: 20px;
`;

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
