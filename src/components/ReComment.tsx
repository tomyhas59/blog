import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_RECOMMENT_REQUEST } from "../reducer/post";
import styled from "styled-components";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faComment } from "@fortawesome/free-solid-svg-icons";
import { CommentType, PostType } from "../types";
import { RootState } from "../reducer";
import ReCommentForm from "./ReCommentForm";
import Spinner from "./Spinner";
import ContentRenderer from "./renderer/ContentRenderer";
import useOutsideClick from "../hooks/useOutsideClick";

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
  const { removeReCommentLoading, updateReCommentLoading } = useSelector(
    (state: RootState) => state.post
  );

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReComment, setAddReComment] = useState<Record<string, boolean>>({});

  const onAddReCommentForm = useCallback((reCommentId: number) => {
    setAddReComment((prev) => {
      const newReCommentState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newReCommentState[key] = false;
      });
      newReCommentState[reCommentId] = !prev[reCommentId];
      return newReCommentState;
    });
  }, []);

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

  //OutsideClick----------------------------------------------

  const reCommentFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([reCommentFormRef], () => {
    setAddReComment({});
  });

  return (
    <>
      {removeReCommentLoading || updateReCommentLoading ? <Spinner /> : null}
      {comment.ReComments.map((reComment) => {
        const regex = /@\w+/g;
        const regexNickname = reComment.content.match(regex);
        const userNickname = regexNickname && regexNickname[0].replace("@", "");
        const userContent = reComment.content.replace(regex, "");

        return (
          <ReCommentWrapper key={reComment.id}>
            <AuthorWrapper>
              <Author>↪ {reComment.User.nickname.slice(0, 5)}</Author>
              <Date>({moment(reComment.createdAt).format("l")})</Date>
            </AuthorWrapper>
            <ContentWrapper>
              <Content>
                <span>{userNickname}</span>
                <ContentRenderer content={userContent} />
              </Content>
              <ReCommentOptions>
                {id && (
                  <Toggle onClick={() => onAddReCommentForm(reComment.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </Toggle>
                )}

                {id === reComment.User.id || nickname === "admin" ? (
                  <Toggle onClick={() => onRemoveReComment(reComment.id)}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </Toggle>
                ) : null}
              </ReCommentOptions>
            </ContentWrapper>
            {addReComment[reComment.id] && (
              <div ref={reCommentFormRef}>
                <ReCommentForm
                  post={post}
                  comment={comment}
                  reComment={reComment}
                  setAddReComment={setAddReComment}
                />
              </div>
            )}
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
  word-break: break-word; /**텍스트 줄바꿈 */
  font-size: 0.8rem;
  & span {
    color: #b3b0b0;
  }
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Toggle = styled.button`
  font-size: 10px;
`;

const Date = styled.span`
  color: gray;
  font-size: 10px;
  @media (max-width: 480px) {
    width: 20px;
  }
`;

const ReCommentOptions = styled.div`
  display: flex;
  & * {
    margin-left: 2px;
  }
`;
