import React, { useCallback } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { ADD_POST_REQUEST } from "../reducer/post";
import { useEffect } from "react";
const PostForm = () => {
  const [content, contentOnChane, setContent] = useInput("");
  const dispatch = useDispatch();
  const { addPostDone, addPostError } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (addPostError) {
      console.log(addPostError);
    }
    if (addPostDone) {
      setContent("");
    }
  }, [addPostDone, addPostError, setContent]);

  const handleRegisterPost = useCallback(
    (e) => {
      e.preventDefault();
      dispatch({
        type: ADD_POST_REQUEST,
        data: content,
      });
    },
    [content, dispatch]
  );

  return (
    <>
      {me ? (
        <FormWrapper>
          <Title>글쓰기</Title>
          <Form onSubmit={handleRegisterPost}>
            <TextArea
              placeholder="Content"
              value={content}
              onChange={contentOnChane}
            ></TextArea>
            <Button type="submit">등록</Button>
          </Form>
          <Form
            action="http://localhost:3075/post/uploads" //저장할 주소
            method="post"
            encType="multipart/form-data"
          >
            <Input type="file" name="image"></Input>
            <Button type="submit">등록</Button>
          </Form>
        </FormWrapper>
      ) : null}
    </>
  );
};

export default PostForm;

const FormWrapper = styled.div`
  max-width: 800px;
  border: 1px solid;
  border-color: silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
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
