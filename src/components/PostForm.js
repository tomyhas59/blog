import React from "react";
import styled from "styled-components";

const PostForm = () => {
  return (
    <Wrapper>
      <Text
        cols="80"
        rows="5"
        placeholder="오늘은 어떤 일이 있었나요?"
        autoComplete="off"
      />
      <Button>등록</Button>
    </Wrapper>
  );
};

export default PostForm;

const Wrapper = styled.div`
  width: 100%;
`;

const Button = styled.div`
  width: 50%;
  background-color: ${(props) => props.theme.mainColor};
  margin: 0 auto;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  :hover {
    opacity: 0.7;
  }
`;

const Text = styled.textarea`
  width: 50%;
`;
