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
import { CommentType, PostType, ReCommentType } from "../types";
import { RootState } from "../reducer";

const ReComment = ({
  post,
  comment,
}: {
  post: PostType;
  comment: CommentType;
}) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);

  //------------------대댓글 수정----------------------------

  const [editReComment, setEditReComment] = useState<{
    [key: number]: boolean;
  }>({});

  const [content, contentOnChane, setContent] = useInput();
  const textRef = useRef(null);
  //현재 열려 있는 대댓글의 id추적하기 위한 상태 변수
  const [currentReCommentId, setCurrentReCommentId] = useState<number | null>(
    null
  );

  const editReCommentHandler = useCallback(
    (recommentId: number, item: ReCommentType) => {
      // 기존 대댓글 닫기
      if (currentReCommentId !== null) {
        setEditReComment((prev) => ({
          ...prev,
          [currentReCommentId]: false,
        }));
      }
      // 현재 열려 있는 대댓글의 id 설정
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
      [currentReCommentId as number]: false,
    }));
    setCurrentReCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentReCommentId, setContent]);

  const modifyReComment = useCallback(
    (reCommentId: number) => {
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
    (e: React.KeyboardEvent<HTMLInputElement>, reCommentId: number) => {
      if (e.key === "Enter") {
        modifyReComment(reCommentId);
      }
    },
    [modifyReComment]
  );

  //---대댓글 삭제----------------------------------------
  const removeReComment = useCallback(
    (reCommentId: number) => {
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
              <Content>{reComment.content}</Content>
            )}
            <Date>{formattedCommentDate}</Date>
            {id === reComment.User.id || nickname === "admin" ? (
              <>
                <Toggle
                  onClick={() => editReCommentHandler(reComment.id, reComment)}
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

const Date = styled.div`
  cursor: default;
  color: gray;
  width: 8%;
  @media (max-width: 480px) {
    font-size: 7px;
  }
`;
