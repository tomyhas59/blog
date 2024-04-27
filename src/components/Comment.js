import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_COMMENT_REQUEST,
  SEARCH_NICKNAME_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from "../reducer/post";
import moment from "moment";
import useInput from "../hooks/useInput";
import ReCommentForm from "./ReCommentForm";
import ReComment from "./ReComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faComment,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const Comment = ({ post }) => {
  const [addReComment, setAddReComment] = useState({});
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const nickname = useSelector((state) => state.user.me?.nickname);

  //----------작성글 보기 팝업-------------------------------------
  const [showPopup, setShowPopup] = useState({});

  const handlePopupToggle = useCallback((commentId) => {
    setShowPopup((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [commentId]: !prev[commentId],
    }));
  }, []);

  const handleSearch = useCallback(
    (comment) => {
      dispatch({
        type: SEARCH_NICKNAME_REQUEST,
        query: comment.User.nickname,
      });
      setShowPopup(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch]
  );

  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState({});
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);

  // 현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentCommentId, setCurrentCommentId] = useState(null);

  const onEditReCommentHandler = useCallback(
    (commentId, item) => {
      // 기존 댓글 닫기
      if (currentCommentId !== null) {
        setEditComment((prev) => ({
          ...prev,
          [currentCommentId]: false,
        }));
      }
      // 현재 열려 있는 댓글의 id 설정
      setCurrentCommentId(commentId);

      setEditComment((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setContent(item.content);
    },
    [currentCommentId, setContent]
  );

  // "취소" 버튼을 누를 때 호출되는 함수
  const handleCancelEdit = useCallback(() => {
    setEditComment((prev) => ({
      ...prev,
      [currentCommentId]: false,
    }));
    setCurrentCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentCommentId, setContent]);

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
      setCurrentCommentId(null);
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

  //----------------map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const onAddReCommentHandler = useCallback((commentId) => {
    setAddReComment((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        //...기존 상태값, acc: 누적 계산값, key: 현재값
        acc[key] = false;
        return acc;
      }, {}),
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

  return (
    <>
      {post.Comments.map((comment) => {
        const isEditing = editComment[comment.id];
        const createdAtDate = moment(comment.createdAt);
        const formattedDate = createdAtDate.format("l");
        return (
          <div key={comment.id}>
            <FullCommentWrapper>
              <CommentWrapper key={comment.id}>
                <Author onClick={() => handlePopupToggle(comment.id)}>
                  <FontAwesomeIcon icon={faUser} />
                  <div>{comment.User.nickname}</div>
                </Author>
                {showPopup[comment.id] ? (
                  <PopupMenu>
                    <Button onClick={() => handleSearch(comment)}>
                      작성 글 보기
                    </Button>
                  </PopupMenu>
                ) : null}
                {isEditing && currentCommentId === comment.id ? (
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
                <Date>{formattedDate}</Date>
                {id ? (
                  <Toggle onClick={() => onAddReCommentHandler(comment.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </Toggle>
                ) : (
                  <NotLoggedIn>
                    <FontAwesomeIcon icon={faComment} />
                  </NotLoggedIn>
                )}
                {id === comment.User.id || nickname === "admin" ? (
                  <>
                    <Toggle
                      onClick={() =>
                        onEditReCommentHandler(comment.id, comment)
                      }
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Toggle>
                    <Toggle
                      onClick={() =>
                        onRemoveComment(
                          comment.id /*매개변수를 위의 함수로 전달*/
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Toggle>
                  </>
                ) : (
                  <>
                    <NotLoggedIn>
                      <FontAwesomeIcon icon={faPen} />
                    </NotLoggedIn>
                    <NotLoggedIn>
                      <FontAwesomeIcon icon={faTrash} />
                    </NotLoggedIn>
                  </>
                )}
              </CommentWrapper>
              <ReComment post={post} comment={comment} />
            </FullCommentWrapper>
            {addReComment[comment.id] ? (
              <ReCommentForm post={post} comment={comment} />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default Comment;

const FullCommentWrapper = styled.div`
  border: 1px solid silver;
`;

const CommentWrapper = styled.div`
  display: flex;
  width: 100%;
  border-radius: 5px;
  padding: 20px;
  position: relative;
`;

const Author = styled.button`
  font-weight: bold;
  width: 10%;
  text-align: center;
  margin-right: 10px;
`;

const Content = styled.div`
  font-weight: bold;
  width: 60%;

  height: 50px;
  line-height: 50px;
`;

const Toggle = styled.button`
  font-weight: bold;
  width: 7%;
`;

const Date = styled.button`
  font-weight: bold;
  width: 7%;
  cursor: default;
  color: gray;
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

const PopupMenu = styled.div`
  position: absolute;
  top: 70%;
  left: 5%;
`;
