import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../reducer/post";
import moment from "moment";
import useInput from "../hooks/useInput";

const Comment = ({ post }) => {
  const [addComment, setAddComment] = useState([]);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState({});
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);

  const onEditCommentHandler = useCallback(
    (commentId, item) => {
      setEditComment((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setContent(item.content);
    },
    [setContent]
  );

  // useEffect(() => {
  //   if (editComment) {
  //     textRef.current.focus();
  //   }
  // }, [editComment]);

  const handleModifyComment = useCallback(
    (commentId) => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId,
          content: content,
        },
      });
      setEditComment(false);
    },
    [content, dispatch, post.id]
  );

  //----------------map 안에서 하나만 작동 코드---------------------
  const onAddCommentHandler = useCallback((commentId) => {
    setAddComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const [reComment, setReComment] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setReComment("");
    },
    [setReComment]
  );

  const onRemoveComment = useCallback(
    (commentId) => {
      return dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: {
          commentId,
          postId: post.id,
        },
      });
    },
    [dispatch, post.id]
  );

  const createdAtDate = moment(post.createdAt);
  const formattedDate = createdAtDate.format("l");
  return (
    <>
      {post.Comments.map((item) => {
        const isEditing = editComment[item.id];
        return (
          <div key={item.id}>
            <CommentWrapper key={item.id}>
              <Author>{item.User.nickname}</Author>
              {isEditing ? (
                <>
                  <Text
                    cols="40"
                    rows="2"
                    value={content}
                    onChange={contentOnChane}
                    ref={textRef}
                  />
                  <EndFlex>
                    <Button onClick={() => handleModifyComment(item.id)}>
                      수정
                    </Button>
                    <Button onClick={() => onEditCommentHandler(item.id)}>
                      취소
                    </Button>
                  </EndFlex>
                </>
              ) : (
                <Content>{item.content}</Content>
              )}
              <Toggle>{formattedDate}</Toggle>
              {id ? (
                <Toggle onClick={() => onAddCommentHandler(item.id)}>
                  댓글
                </Toggle>
              ) : (
                <NotLoggedIn>댓글</NotLoggedIn>
              )}
              {id === item.User.id ? (
                <>
                  <Toggle onClick={() => onEditCommentHandler(item.id, item)}>
                    수정
                  </Toggle>
                  <Toggle
                    onClick={() =>
                      onRemoveComment(item.id /*매개변수를 위의 함수로 전달*/)
                    }
                  >
                    삭제
                  </Toggle>
                </>
              ) : (
                <>
                  <NotLoggedIn>수정</NotLoggedIn>
                  <NotLoggedIn>삭제</NotLoggedIn>
                </>
              )}
            </CommentWrapper>
            {addComment[item.id] ? (
              <Form onSubmit={handleSubmit}>
                <InputComment
                  type="text"
                  placeholder="Comment"
                  value={reComment}
                  onChange={(e) => setReComment(e.target.value)}
                />
                <Button type="submit">등록</Button>
              </Form>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default Comment;
const CommentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.mainColor};
  display: flex;
  width: 100%;
  border-radius: 5px;
  padding: 20px;
`;

const Author = styled.div`
  font-weight: bold;
  width: 10%;
  text-align: center;
  margin-right: 10px;
`;

const Content = styled.div`
  font-weight: bold;
  width: 60%;
`;

const Toggle = styled.button`
  font-weight: bold;
  width: 7%;
`;

const NotLoggedIn = styled.button`
  font-weight: bold;
  width: 8%;
  color: gray;
  cursor: default;
`;

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

const Text = styled.textarea`
  width: 46%;
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;
