import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../reducer/post";
import moment from "moment";
import useInput from "../hooks/useInput";
import ReCommentForm from "./ReCommentForm";
import ReComment from "./ReComment";

const Comment = ({ post }) => {
  const [addComment, setAddComment] = useState([]);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState({});
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);
  // 현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentEditingCommentId, setCurrentEditingCommentId] = useState(null);

  const onEditCommentHandler = useCallback(
    (commentId, item) => {
      // 기존 댓글 닫기
      if (currentEditingCommentId !== null) {
        setEditComment((prev) => ({
          ...prev,
          [currentEditingCommentId]: false,
        }));
      }
      // 현재 열려 있는 댓글의 id 설정
      setCurrentEditingCommentId(commentId);

      setEditComment((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setContent(item.content);
    },
    [currentEditingCommentId, setContent]
  );

  // "취소" 버튼을 누를 때 호출되는 함수
  const handleCancelEdit = useCallback(() => {
    setEditComment((prev) => ({
      ...prev,
      [currentEditingCommentId]: false,
    }));
    setCurrentEditingCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentEditingCommentId, setContent]);

  const handleModifyComment = useCallback(
    (commentId) => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId: commentId,
          content: content,
        },
      });
      setEditComment({});
      setCurrentEditingCommentId(null);
      setContent(""); // "Text" 영역 초기화
    },
    [content, dispatch, post.id, setContent]
  );
  const Enter = useCallback(
    (e, commentId) => {
      if (e.key === "Enter") {
        handleModifyComment(commentId);
      }
    },
    [handleModifyComment]
  );

  //----------------map 안에서 하나만 작동 코드---------------------
  const onAddCommentHandler = useCallback((commentId) => {
    setAddComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  //---댓글 삭제-----------------------------------------------------
  const onRemoveComment = useCallback(
    (commentId) => {
      if (!window.confirm("삭제하시겠습니까?")) return false;
      dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: {
          commentId: commentId,
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
      {post.Comments.map((comment) => {
        const isEditing = editComment[comment.id];
        return (
          <div key={comment.id}>
            <CommentWrapper key={comment.id}>
              <Author>{comment.User.nickname}</Author>
              {isEditing && currentEditingCommentId === comment.id ? (
                <>
                  <Text
                    cols="40"
                    rows="2"
                    value={content}
                    onChange={contentOnChane}
                    ref={textRef}
                    onKeyUp={(e) => Enter(e, comment.id)}
                  />
                  <EndFlex>
                    <Button onClick={() => handleModifyComment(comment.id)}>
                      수정
                    </Button>
                    <Button onClick={handleCancelEdit}>취소</Button>
                  </EndFlex>
                </>
              ) : (
                <Content>{comment.content}</Content>
              )}
              <Toggle>{formattedDate}</Toggle>
              {id ? (
                <Toggle onClick={() => onAddCommentHandler(comment.id)}>
                  댓글
                </Toggle>
              ) : (
                <NotLoggedIn>댓글</NotLoggedIn>
              )}
              {id === comment.User.id ? (
                <>
                  <Toggle
                    onClick={() => onEditCommentHandler(comment.id, comment)}
                  >
                    수정
                  </Toggle>
                  <Toggle
                    onClick={() =>
                      onRemoveComment(
                        comment.id /*매개변수를 위의 함수로 전달*/
                      )
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
            {addComment[comment.id] ? (
              <ReCommentForm comment={comment} />
            ) : null}
            <ReComment comment={comment} />
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
