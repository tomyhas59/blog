import React, { useCallback, useState } from "react";
import styled from "styled-components";

const Comment = ({ nickname, content }) => {
  const [addComment, setAddComment] = useState(false);
  const onAddCommentHandler = useCallback(() => {
    setAddComment((prev) => !prev);
  }, []);
  const [reComment, setReComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setReComment("");
  };

  return (
    <>
      <CommentWrapper>
        <Author>{nickname}이용현</Author>
        <Content>{content}안녕하세요</Content>
        <Toggle>날짜</Toggle>
        <Toggle onClick={onAddCommentHandler}>댓글</Toggle>
        <Toggle>수정</Toggle>
        <Toggle>삭제</Toggle>
      </CommentWrapper>
      {addComment ? (
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

const Toggle = styled.div`
  font-weight: bold;
  width: 8%;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const InputComment = styled.input`
  width: 70%;
`;

const Button = styled.span`
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
