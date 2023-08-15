import React from "react";
import { useState, useRef, useCallback } from "react";
import useInput from "../hooks/useInput";
import { useSelector, useDispatch } from "react-redux";
import {
  REMOVE_RECOMMENT_REQUEST,
  UPDATE_RECOMMENT_REQUEST,
} from "../reducer/post";
import styled from "styled-components";
const ReComment = ({ post, comment }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  //------------------댓글 수정----------------------------

  const [editReComment, setEditReComment] = useState({});
  const [content, contentOnChane, setContent] = useInput("");
  const textRef = useRef(null);
  //현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentEditingReCommentId, setCurrentEditingReCommentId] =
    useState(null);

  const onEditReCommentHandler = useCallback(
    (recommentId, item) => {
      // 기존 댓글 닫기
      if (currentEditingReCommentId !== null) {
        setEditReComment((prev) => ({
          ...prev,
          [currentEditingReCommentId]: false,
        }));
      }
      // 현재 열려 있는 댓글의 id 설정
      setCurrentEditingReCommentId(recommentId);

      setEditReComment((prev) => ({
        ...prev,
        [recommentId]: !prev[recommentId],
      }));
      setContent(item.content);
    },
    [currentEditingReCommentId, setContent]
  );

  // "취소" 버튼을 누를 때 호출되는 함수
  const handleCancelEdit = useCallback(() => {
    setEditReComment((prev) => ({
      ...prev,
      [currentEditingReCommentId]: false,
    }));
    setCurrentEditingReCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentEditingReCommentId, setContent]);

  const handleModifyReComment = useCallback(
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
      setCurrentEditingReCommentId(null);
      setContent(""); // "Text" 영역 초기화
    },
    [comment.id, content, dispatch, post.id, setContent]
  );
  const Enter = useCallback(
    (e, reCommentId) => {
      if (e.key === "Enter") {
        handleModifyReComment(reCommentId);
      }
    },
    [handleModifyReComment]
  );

  //---댓글 삭제----------------------------------------
  const onRemoveReComment = useCallback(
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
        return (
          <div key={reComment.id}>
            <CommentWrapper key={reComment.id}>
              <Author>{reComment.User.nickname}</Author>
              {isEditing && currentEditingReCommentId === reComment.id ? (
                <>
                  <Text
                    value={content}
                    onChange={contentOnChane}
                    ref={textRef}
                    onKeyUp={(e) => Enter(e, reComment.id)}
                  />
                  <EndFlex>
                    <Button onClick={() => handleModifyReComment(reComment.id)}>
                      수정
                    </Button>
                    <Button onClick={handleCancelEdit}>취소</Button>
                  </EndFlex>
                </>
              ) : (
                <Content>{reComment.content}</Content>
              )}
              {id === reComment.User.id ? (
                <>
                  <Toggle
                    onClick={() =>
                      onEditReCommentHandler(reComment.id, reComment)
                    }
                  >
                    수정
                  </Toggle>
                  <Toggle
                    onClick={() =>
                      onRemoveReComment(
                        reComment.id /*매개변수를 위의 함수로 전달*/
                      )
                    }
                  >
                    삭제
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
  border: 1px solid ${(props) => props.theme.mainColor};
  background-color: #fff;
  display: flex;
  width: 80%;
  border-radius: 5px;
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
