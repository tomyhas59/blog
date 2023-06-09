import React, { useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch } from "react-redux";
import { REGISTER_POST } from "../reducer/post";

const PostForm = () => {
  const [title, titleOnChane] = useInput("");
  const [content, contentOnChane] = useInput("");
  const dispatch = useDispatch();

  const [newPost, setNewPost] = useState({
    id: "",
    title: "",
    content: "",
  });

  const handleRegisterPost = (e) => {
    e.preventDefault();
    dispatch({
      type: REGISTER_POST,
      payload: newPost,
    });
    setNewPost({
      id: "",
      title: "",
      content: "",
    });
  };

  return (
    <FormContainer>
      <Title>글쓰기</Title>
      <Form onSubmit={handleRegisterPost}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={titleOnChane}
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChange={contentOnChane}
        ></TextArea>
        <Button type="submit">등록</Button>
      </Form>
    </FormContainer>
  );
};

export default PostForm;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
