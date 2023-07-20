import React, { useState, useCallback } from "react";
import styled from "styled-components";

const ReCommentForm = () => {
  const [reComment, setReComment] = useState("");
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setReComment("");
    },
    [setReComment]
  );
  return (
    <Form onSubmit={handleSubmit}>
      <InputComment
        type="text"
        placeholder="Comment"
        value={reComment}
        onChange={(e) => setReComment(e.target.value)}
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
