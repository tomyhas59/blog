import React, { useCallback, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../reducer/post";
const Post = ({ post, title, content }) => {
  const dispatch = useDispatch();
  const allposts = useSelector((state) => state.post.allposts);

  const [editPost, setEditPost] = useState(false);
  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
  }, []);

  const [addComment, setaddComment] = useState(false);
  const onAddCommentHandler = useCallback(() => {
    setaddComment((prev) => !prev);
  }, []);

  const handleModifyPost = () => {
    dispatch({
      type: UPDATE_COMMENT_REQUEST,
      data: {
        postId: post.id,
        title: title,
        content: content,
      },
    });
  };

  const handleDeletePost = useCallback(() => {
    dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: post.id ,
    });
  }, [dispatch]);

  return (
    <FormWrapper>
      <CommentFlex>
        <div>
          <Span>name</Span>
          <Span>date</Span>
        </div>
      </CommentFlex>

      <PostWrapper>
        {editPost ? (
          <>
            <Text cols="80" row="5" />
            <div>
              <Button onClick={handleModifyPost}>수정</Button>
              <Button onClick={onEditPostHandler}>취소</Button>
              <Button onClick={handleDeletePost}>삭제</Button>
            </div>
          </>
        ) : (
          allposts.map((post) => (
            <ContentWrapper onClick={onEditPostHandler}>
              <div>{post.title}</div>
              <div>{post.contnet}</div>
            </ContentWrapper>
          ))
        )}
      </PostWrapper>

      <br />
      <CommentContainer>
        <CommentFlex>
          <Span>댓글 1개</Span>
          <Info onClick={onAddCommentHandler}>댓글 달기</Info>
        </CommentFlex>
        {addComment ? (
          <div>
            <CommentForm />
            <Comment />
          </div>
        ) : null}
      </CommentContainer>
    </FormWrapper>
  );
};

export default Post;

const FormWrapper = styled.div`
  max-width: 800px;
  border: 1px solid;
  border-color: silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const PostWrapper = styled.div`
  width: 80%;
  border: 1px solid;
  border-color: silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;
const Text = styled.textarea`
  width: 80%;
`;

const Button = styled.span`
  width: 80%;
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

const Info = styled.span`
  width: 100px;
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
`;

const CommentFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  width: 100%;
  border: 1px solid;
  border-color: silver;
  height: 70px;
  border-radius: 5px;
  margin: 0 auto;
  padding: 5px;
`;

const Span = styled.span`
  width: 100px;
  margin: 2px;
  color: ${(props) => props.theme.mainColor};
  padding: 6px;
`;

const CommentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
