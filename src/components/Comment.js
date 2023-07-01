import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_COMMENT_REQUEST } from "../reducer/post";
const Comment = ({ post }) => {
  const [addComment, setAddComment] = useState({});

  //----------------map 안에서 하나만 작동 코드---------------------
  const onAddCommentHandler = useCallback((commentId) => {
    setAddComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const [reComment, setReComment] = useState("");
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setReComment("");
  }, []);

  const handleDeleteComment = useCallback(
    (commentId) /*전달받은 매개변수*/ => {
      dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId,
        },
      });
    },
    [dispatch, post.id]
  );

  return (
    <>
      {post.Comments.map((item) => (
        <>
          <CommentWrapper key={item.id}>
            <Author>{item.User.nickname}</Author>
            <Content>{item.content}</Content>
            <Toggle>날짜</Toggle>
            <Toggle onClick={() => onAddCommentHandler(item.id)}>댓글</Toggle>
            {id === item.User.id ? (
              <>
                <Toggle>수정</Toggle>
                <Toggle
                  onClick={() =>
                    handleDeleteComment(item.id /*매개변수를 위의 함수로 전달*/)
                  }
                >
                  삭제
                </Toggle>
              </>
            ) : (
              <>
                <Not>수정</Not>
                <Not>삭제</Not>
              </>
            )}
          </CommentWrapper>
          {addComment[item.id] ? (
            <Form onSubmit={handleSubmit}>
              <InputComment
                type="text"
                placeholder="Comment"
                value={reComment}
                onChange={(e) => setReComment(e.target.value)}
              />
              <Button type="submit">등록</Button>
            </Form>
          ) : null}
        </>
      ))}
    </>
  );
};

export default Comment;
const CommentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.mainColor};
  display: flex;
  width: 100%;
  border-radius: 5px;
  padding: 20px;
`;

const Author = styled.div`
  font-weight: bold;
  width: 10%;
  text-align: center;
  margin-right: 10px;
`;

const Content = styled.div`
  font-weight: bold;
  width: 60%;
`;

const Toggle = styled.button`
  font-weight: bold;
  width: 8%;
`;

const Not = styled.button`
  font-weight: bold;
  width: 8%;
  color: gray;
  cursor: default;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const InputComment = styled.input`
  width: 70%;
`;

const Button = styled.button`
  width: 15%;
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
