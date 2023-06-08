import React, { useCallback, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";

const Post = () => {
  const [editPost, setEditPost] = useState(false);
  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
  }, []);
  return (
    <All>
      <Wrapper>
        <FlexForm>
          <div>
            <div>name</div>
            <div>date</div>
          </div>
          <div>
            <button onClick={onEditPostHandler}>수정</button>
            <button>삭제</button>
          </div>
        </FlexForm>
        <div>
          {editPost ? (
            <>
              <Text cols="80" row="5" />
              <Button>수정하기</Button>
            </>
          ) : (
            <div>안녕하세요 반가운 하루입니다.</div>
          )}
        </div>
        <br />
        <div>content</div>
        <FlexForm>
          <div>댓글 1개</div>
          <div>댓글 달기</div>
        </FlexForm>
        <div>
          <CommentForm />
          <Comment />
        </div>
      </Wrapper>
    </All>
  );
};

export default Post;

const Wrapper = styled.div`
  width: 50%;
  border: 1px solid;
  border-color: silver;
  margin: 0 auto;
`;

const All = styled.div`
  width: 100%;
`;

const Text = styled.textarea`
  width: 80%;
`;

const Button = styled.div`
  width: 80%;
  background-color: ${(props) => props.theme.mainColor};
  margin: 0 auto;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  :hover {
    opacity: 0.7;
  }
`;

const FlexForm = styled.div`
  display: flex;
  justify-content: space-between;
`;
