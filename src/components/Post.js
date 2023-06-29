import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_POST_REQUEST, UPDATE_POST_REQUEST } from "../reducer/post";
import useInput from "../hooks/useInput";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);
  const { updatePostDone } = useSelector((state) => state.post);
  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
    setContent("");
  }, [setContent]);

  useEffect(() => {
    if (editPost) {
      textRef.current.focus();
    }
  }, [editPost]);

  const [addComment, setAddComment] = useState(false);
  const onAddCommentHandler = useCallback(() => {
    setAddComment((prev) => !prev);
  }, []);

  const handleModifyPost = useCallback(() => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        postId: post.id,
        content: content,
      },
    });
  }, [content, dispatch, post.id]);

  useEffect(() => {
    if (updatePostDone) {
      setEditPost(false);
    }
  }, [updatePostDone]);

  const handleDeletePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  return (
    <FormWrapper>
      <BetweenFlex>
        <div>
          <Span>{post.User.nickname}</Span>
          <Span>날짜</Span>
        </div>
        <div>
          <Button onClick={onEditPostHandler}>수정</Button>
          <Button onClick={handleDeletePost}>삭제</Button>
        </div>
      </BetweenFlex>

      <PostWrapper>
        {editPost ? (
          <>
            <Text
              cols="80"
              rows="5"
              value={content}
              onChange={contentOnChane}
              ref={textRef}
            />
            <EndFlex>
              <Button onClick={handleModifyPost}>수정</Button>
              <Button onClick={onEditPostHandler}>취소</Button>
            </EndFlex>
          </>
        ) : (
          <ContentWrapper>
            <div>{post.content}</div>
          </ContentWrapper>
        )}
      </PostWrapper>

      <CommentContainer>
        <BetweenFlex>
          <Span>{post.length}개</Span>
          <Info onClick={onAddCommentHandler}>댓글 달기</Info>
        </BetweenFlex>
        <Comment />
        {addComment ? (
          <div>
            <CommentForm />
          </div>
        ) : null}
      </CommentContainer>
    </FormWrapper>
  );
};

export default Post;

const FormWrapper = styled.div`
  max-width: 800px;
  border: 1px solid silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const PostWrapper = styled.div`
  width: 100%;
  border: 1px solid silver;
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

const BetweenFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;
const ContentWrapper = styled.div`
  width: 100%;
  border: 1px solid silver;
  height: 70px;
  border-radius: 5px;
  margin: 0 auto;
  padding: 5px;
`;

const Span = styled.span`
  width: 100px;
  margin: 2px;
  color: #000;
  padding: 6px;
  font-weight: bold;
`;

const CommentContainer = styled.div`
  background-color: ${(props) => props.theme.subColor};
  margin: 0 auto;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.mainColor};
  border-radius: 4px;
`;
