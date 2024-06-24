import React, { useEffect } from "react";
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

  const [editReComment, setEditReComment] = useState<Record<number, boolean>>(
    {}
  );

  const [content, onChangeContent, setContent] = useInput();
  const editReCommentRef = useRef<HTMLInputElement>(null);

  //현재 열려 있는 대댓글의 id추적하기 위한 상태 변수
  const [currentReCommentId, setCurrentReCommentId] = useState<number | null>(
    null
  );

  const onEditReCommentForm = useCallback(
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

  useEffect(() => {
    if (editReComment[currentReCommentId!] && editReCommentRef.current) {
      editReCommentRef.current.focus();
    }
  }, [editReComment, currentReCommentId]);

  // "취소" 버튼을 누를 때 호출되는 함수
  const onCancelEditReComment = useCallback(() => {
    setEditReComment((prev) => ({
      ...prev,
      [currentReCommentId as number]: false,
    }));
    setCurrentReCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentReCommentId, setContent]);

  const onModifyReComment = useCallback(
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
  const onEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, reCommentId: number) => {
      if (e.key === "Enter") {
        onModifyReComment(reCommentId);
      }
    },
    [onModifyReComment]
  );

  //---대댓글 삭제----------------------------------------
  const onRemoveReComment = useCallback(
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
          <ReCommentWrapper key={reComment.id}>
            <AuthorWrapper>
              <Author>↪ {reComment.User.nickname.slice(0, 5)}</Author>
              <Date>({formattedCommentDate})</Date>
            </AuthorWrapper>
            <ContentWrapper>
              {isEditing && currentReCommentId === reComment.id ? (
                <>
                  <Input
                    value={content}
                    onChange={onChangeContent}
                    ref={editReCommentRef}
                    onKeyUp={(e) => onEnterKeyPress(e, reComment.id)}
                  />
                  <EndFlex>
                    <Button onClick={() => onModifyReComment(reComment.id)}>
                      수정
                    </Button>
                    <Button onClick={onCancelEditReComment}>취소</Button>
                  </EndFlex>
                </>
              ) : (
                <Content>{reComment.content}</Content>
              )}
              <ReCommentOptions>
                {id === reComment.User.id || nickname === "admin" ? (
                  <>
                    <Toggle
                      onClick={() =>
                        onEditReCommentForm(reComment.id, reComment)
                      }
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Toggle>
                    <Toggle
                      onClick={() =>
                        onRemoveReComment(
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
              </ReCommentOptions>
            </ContentWrapper>
          </ReCommentWrapper>
        );
      })}
    </>
  );
};

export default ReComment;

const ReCommentWrapper = styled.div`
  width: 85%;
  padding: 5px;
  margin: 0 auto;
  border-top: 1px solid silver;
  background-color: #edf7f9;
`;

const AuthorWrapper = styled.div`
  position: relative;
`;

const Author = styled.span`
  text-align: center;
  margin-right: 10px;
  color: ${(props) => props.theme.mainColor};
`;

const ContentWrapper = styled.div`
  padding: 5px;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 90%;
  /**내용 수직 정렬용 */
  display: flex;
  align-items: center;
  word-break: break-word; /**텍스트 줄바꿈 */
`;

const Toggle = styled.button`
  font-size: 10px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const Input = styled.input`
  width: 77%;
  @media (max-width: 480px) {
    width: 50%;
  }
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;

const Date = styled.span`
  color: gray;
  font-size: 10px;
  @media (max-width: 480px) {
    width: 20px;
    font-size: 7px;
  }
`;

const ReCommentOptions = styled.div`
  display: flex;
  & * {
    margin-left: 2px;
  }
`;
