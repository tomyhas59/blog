import React from "react";
import styled from "styled-components";

const Comment = ({ author, content }) => {
  return (
    <CommentWrapper>
      <Author>{author}이용현</Author>
      <Content>{content}안녕하세요</Content>
      <Toggle>날짜</Toggle>
      <Toggle>댓글</Toggle>
      <Toggle>삭제</Toggle>
    </CommentWrapper>
  );
};

export default Comment;
const CommentWrapper = styled.div`
  border: 1px solid;
  display: flex;
  width: 100%;
  border-radius: 5px;
  padding: 20px;
  border-color: silver;
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
  width: 10%;
`;
