import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_POST_REQUEST, UPDATE_POST_REQUEST } from "../reducer/post";
import useInput from "../hooks/useInput";
import moment from "moment";
import "moment/locale/ko";
const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, contentOnChane, setContent] = useInput("");
  const editPostRef = useRef(null);
  const editCommentRef = useRef(null);

  const id = useSelector((state) => state.user.me?.id);

  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
    setContent(post.content);
  }, [post.content, setContent]);

  useEffect(() => {
    if (editPost) {
      editPostRef.current.focus();
    }
  }, [editPost]);

  const [addComment, setAddComment] = useState(false);
  const onAddCommentHandler = useCallback(() => {
    if (!id) {
      alert("로그인이 필요합니다");
    } else setAddComment((prev) => !prev);
  }, [id]);

  const handleModifyPost = useCallback(() => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        postId: post.id,
        content: content,
      },
    });
    setEditPost(false);
  }, [content, dispatch, post.id]);

  const handleDeletePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  const createdAtDate = moment(post.createdAt);
  const formattedDate = createdAtDate.format("l");

  return (
    <FormWrapper>
      <BetweenFlex>
        <div>
          <Span>{post.User.nickname}</Span>
          <Span>{formattedDate}</Span>
        </div>
        {id === post.User.id ? (
          <div>
            <Button onClick={onEditPostHandler}>수정</Button>
            <Button onClick={handleDeletePost}>삭제</Button>
          </div>
        ) : (
          <Button>♥</Button>
        )}
      </BetweenFlex>

      <PostWrapper>
        {editPost ? (
          <>
            <Text
              cols="80"
              rows="5"
              value={content}
              onChange={contentOnChane}
              ref={editPostRef}
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
          <Span>{post.Comments.length}개</Span>
          <Info onClick={onAddCommentHandler}>댓글 달기</Info>
        </BetweenFlex>
        {addComment ? (
          <div>
            <CommentForm
              post={post}
              editCommentRef={editCommentRef}
              setEditPost={setEditPost}
            />
          </div>
        ) : null}
        <Comment post={post} />
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

const Button = styled.span`
  width: 50px;
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
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

const Text = styled.textarea`
  width: 100%;
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
