import React, { useState } from "react";
import styled from "styled-components";



const CommentForm = ({ onSubmit }) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ author, content });
    setAuthor("");
    setContent("");
  };

  return (
    <CommentWrapper>
      <Form onSubmit={handleSubmit}>
        <InputName
          type="text"
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <InputComment
          type="text"
          placeholder="Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit">등록</Button>
      </Form>
    </CommentWrapper>
  );
};

export default CommentForm;

const CommentWrapper = styled.div`
  border: 1px solid;
  border-color: silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const InputName = styled.input`
  width: 15%;
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
