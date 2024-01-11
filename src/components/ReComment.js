import React from "react";
import { useState, useRef, useCallback } from "react";
import useInput from "../hooks/useInput";
import { useSelector, useDispatch } from "react-redux";
import {
  REMOVE_RECOMMENT_REQUEST,
  UPDATE_RECOMMENT_REQUEST,
} from "../reducer/post";
import styled from "styled-components";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPen } from "@fortawesome/free-solid-svg-icons";

const ReComment = ({ post, comment }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  //------------------댓글 수정----------------------------

  const [editReComment, setEditReComment] = useState({});
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);
  //현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentReCommentId, setCurrentReCommentId] = useState(null);

  const editReCommentHandler = useCallback(
    (recommentId, item) => {
      // 기존 댓글 닫기
      if (currentReCommentId !== null) {
        setEditReComment((prev) => ({
          ...prev,
          [currentReCommentId]: false,
        }));
      }
      // 현재 열려 있는 댓글의 id 설정
      setCurrentReCommentId(recommentId);

      setEditReComment((prev) => ({
        ...prev,
        [recommentId]: !prev[recommentId],
      }));
      setContent(item.content);
    },
    [currentReCommentId, setContent]
  );

  // "취소" 버튼을 누를 때 호출되는 함수
  const cancelEdit = useCallback(() => {
    setEditReComment((prev) => ({
      ...prev,
      [currentReCommentId]: false,
    }));
    setCurrentReCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentReCommentId, setContent]);

  const modifyReComment = useCallback(
    (reCommentId) => {
      dispatch({
        type: UPDATE_RECOMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId: comment.id,
          reCommentId: reCommentId,
          content: content,
        },
      });
      setEditReComment({});
      setCurrentReCommentId(null);
      setContent(""); // "Text" 영역 초기화
    },
    [comment.id, content, dispatch, post.id, setContent]
  );
  const Enter = useCallback(
    (e, reCommentId) => {
      if (e.key === "Enter") {
        modifyReComment(reCommentId);
      }
    },
    [modifyReComment]
  );

  //---댓글 삭제----------------------------------------
  const removeReComment = useCallback(
    (reCommentId) => {
      if (!window.confirm("삭제하시겠습니까?")) return false;
      dispatch({
        type: REMOVE_RECOMMENT_REQUEST,
        data: {
          postId: post.id,
          reCommentId: reCommentId,
          commentId: comment.id,
        },
      });
    },
    [comment.id, dispatch, post.id]
  );

  return (
    <>
      {comment.ReComments.map((reComment) => {
        const isEditing = editReComment[reComment.id];
        const createdAtCommentDate = moment(reComment.createdAt);
        const formattedCommentDate = createdAtCommentDate.format("l");
        return (
          <div key={reComment.id}>
            <CommentWrapper key={reComment.id}>
              <Author>☞{reComment.User.nickname}</Author>
              {isEditing && currentReCommentId === reComment.id ? (
                <>
                  <Text
                    value={content}
                    onChange={contentOnChane}
                    ref={textRef}
                    onKeyUp={(e) => Enter(e, reComment.id)}
                  />
                  <EndFlex>
                    <Button onClick={() => modifyReComment(reComment.id)}>
                      수정
                    </Button>
                    <Button onClick={cancelEdit}>취소</Button>
                  </EndFlex>
                </>
              ) : (
                <>
                  <Content>{reComment.content}</Content>
                  <Date>{formattedCommentDate}</Date>
                </>
              )}
              {id === reComment.User.id ? (
                <>
                  <Toggle
                    onClick={() =>
                      editReCommentHandler(reComment.id, reComment)
                    }
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Toggle>
                  <Toggle
                    onClick={() =>
                      removeReComment(
                        reComment.id /*매개변수를 위의 함수로 전달*/
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </Toggle>
                </>
              ) : (
                <>{null}</>
              )}
            </CommentWrapper>
          </div>
        );
      })}
    </>
  );
};

export default ReComment;

const CommentWrapper = styled.div`
  background-color: #fff;
  display: flex;
  width: 80%;
  border-top: 1px solid silver;
  padding: 5px;
  margin: 0 auto;
`;

const Author = styled.div`
  width: 10%;
  text-align: center;
  margin-right: 10px;
`;

const Content = styled.div`
  width: 70%;
`;

const Toggle = styled.button`
  width: 7%;
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

const Text = styled.input`
  width: 56%;
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;

const Date = styled.button`
  cursor: default;
  color: gray;
`;
