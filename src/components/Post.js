import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  UPDATE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  SEARCH_NICKNAME_REQUEST,
} from "../reducer/post";
import useInput from "../hooks/useInput";
import moment from "moment";
import "moment/locale/ko";

const Post = ({ post }) => {
  const [addComment, setAddComment] = useState({});
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, contentOnChane, setContent] = useInput("");
  const editPostRef = useRef(null);
  const editCommentRef = useRef(null);
  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id);
  //----------팝업-------------------------------------
  const [showPopup, setShowPopup] = useState(false);
  const handlePopupToggle = useCallback(() => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  }, []);
  //----------------------------------------------
  const popupRef = useRef(null);
  const nicknameButtonRef = useRef(null);
  const handleOutsideClick = useCallback((event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      event.target !== nicknameButtonRef.current
    ) {
      setShowPopup(false);
    }
  }, []);
  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  //-----게시글 수정-------------------------
  const onEditPostHandler = useCallback(() => {
    setEditPost((prev) => !prev);
    setContent(post.content);
  }, [post.content, setContent]);
  //---------------------------------------------
  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, id, post.id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, id, post.id]);

  useEffect(() => {
    if (editPost) {
      editPostRef.current.focus();
    }
  }, [editPost]);

  //-----기존 폼 닫고 새로운 폼 엶--------------
  const onAddCommentHandler = useCallback(
    (postId) => {
      if (!id) {
        alert("로그인이 필요합니다");
      } else
        setAddComment((prev) => ({
          ...prev,
          [postId]: !prev[postId], //참이면 거짓, 거짓이면 참이 됨
        }));
    },
    [id]
  );

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

  const handleSearch = useCallback(() => {
    dispatch({
      type: SEARCH_NICKNAME_REQUEST,
      query: post.User.nickname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [dispatch, post.User.nickname]);

  return (
    <>
      <FormWrapper>
        <PostWrapper>
          <PostHeaderFlex>
            <PostHeader>
              <NicknameButton
                onClick={handlePopupToggle}
                ref={nicknameButtonRef}
              >
                {post.User.nickname}
              </NicknameButton>
              {showPopup && (
                <PopupMenu ref={popupRef}>
                  <Button onClick={handleSearch}>작성 글 보기</Button>
                </PopupMenu>
              )}
              <Span>{formattedDate}</Span>
            </PostHeader>
            <div>
              <Liked>좋아요 {post.Likers.length}</Liked>
              {id === post.User.id ? null : liked ? (
                <Button onClick={onUnLike}>♥</Button>
              ) : (
                <Button onClick={onLike}>♡</Button>
              )}
            </div>
          </PostHeaderFlex>
          <InPostWrapper>
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
                {post.Images.map((v) => (
                  <Img
                    key={v.id}
                    src={`http://localhost:3075/${v.src}`}
                    alt={v.src}
                  />
                ))}
              </ContentWrapper>
            )}
          </InPostWrapper>
          {id === post.User.id ? (
            <EditDeleteForm>
              <Button onClick={onEditPostHandler}>수정</Button>
              <Button onClick={handleDeletePost}>삭제</Button>
            </EditDeleteForm>
          ) : null}
        </PostWrapper>
        <CommentContainer>
          <PostHeaderFlex>
            <Span>댓글 {post.Comments.length}개</Span>
            <Info onClick={() => onAddCommentHandler(post.id)}>댓글 달기</Info>
          </PostHeaderFlex>
          {addComment[post.id] ? (
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
    </>
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
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const InPostWrapper = styled.div`
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

const Liked = styled.span`
  width: 50px;
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
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

const PostHeaderFlex = styled.div`
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
  overflow: hidden;
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
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
`;

const EditDeleteForm = styled.div`
  float: right;
`;

const Img = styled.img`
  display: inline;
  width: 50%;
`;

const NicknameButton = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 30%;
  width: 50px;
  text-align: center;
  color: #fff;
`;

const PostHeader = styled.div`
  position: relative;
`;
const PopupMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
`;
