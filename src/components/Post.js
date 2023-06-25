import React, { useCallback, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_COMMENT_REQUEST,
  REMOVE_POST_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../reducer/post";
import useInput from "../hooks/useInput";
const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, contentOnChane, setContent] = useInput("");

  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
    setContent("");
  }, [setContent]);

  const [addComment, setAddComment] = useState(false);
  const onAddCommentHandler = useCallback(() => {
    setAddComment((prev) => !prev);
  }, []);

  const handleModifyPost = useCallback(() => {
    dispatch({
      type: UPDATE_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: content,
      },
    });
  }, [content, dispatch, post.id]);

  const handleDeletePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  return (
    <FormWrapper>
      <CommentFlex>
        <div>
          <Span>{post.User.nickname}</Span>
          <Span>날짜</Span>
        </div>
        <div>
          <Button onClick={onEditPostHandler}>수정</Button>
          <Button onClick={handleDeletePost}>삭제</Button>
        </div>
      </CommentFlex>

      <PostWrapper>
        {editPost ? (
          <>
            <Text
              cols="80"
              rows="5"
              value={content}
              onChange={contentOnChane}
            />
            <CommentFlexEnd>
              <Button onClick={handleModifyPost}>수정</Button>
              <Button onClick={onEditPostHandler}>취소</Button>
            </CommentFlexEnd>
          </>
        ) : (
          <ContentWrapper>
            <div>{post.content}</div>
          </ContentWrapper>
        )}
      </PostWrapper>

      <CommentContainer>
        <CommentFlex>
          <Span>{post.length}개</Span>
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
  width: 100%;
`;

const Button = styled.span`
  width: 50px;
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

const CommentFlexEnd = styled.div`
  display: flex;
  justify-content: end;
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
