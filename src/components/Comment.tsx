import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { PostType } from "../types";
import { RootState } from "../reducer";
import Spinner from "./Spinner";
import ContentRenderer from "./renderer/ContentRenderer";
import useOutsideClick from "../hooks/useOutsideClick";
import useTextareaAutoHeight from "../hooks/useTextareaAutoHeight";
const Comment = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const { removeCommentLoading, updateCommentLoading, addReCommentLoading } =
    useSelector((state: RootState) => state.post);

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showInfo, setShowinfo] = useState<Record<number, boolean>>({});

  const toggleShowInfo = useCallback((commentId: number) => {
    setShowinfo((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[commentId] = !prev[commentId];
      return updatedPopupState;
    });
  }, []);

  const onSearch = useCallback(
    (userNickname: string) => {
      dispatch({
        type: SEARCH_NICKNAME_REQUEST,
        query: userNickname,
      });
      setShowinfo({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch]
  );
  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState<Record<number, boolean>>({});
  const [content, , setContent] = useInput();

  const onChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const editCommentRef = useRef<HTMLTextAreaElement>(null);

  // 현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  const onEditCommentForm = useCallback(
    (commentId: number, commentContent: string) => {
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
      setContent(commentContent);
    },
    [currentCommentId, setContent]
  );

  //수정 시 높이 조정
  useTextareaAutoHeight(editCommentRef, editComment);

  // "취소" 버튼을 누를 때 호출되는 함수
  const onCancelEditComment = useCallback(() => {
    setEditComment((prev) => ({
      ...prev,
      [currentCommentId as number]: false,
    }));
    setCurrentCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentCommentId, setContent]);

  const onModifytComment = useCallback(
    (commentId: number) => {
      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: post.id,
          commentId: commentId,
          content: contentWithBreaks,
        },
      });
      setEditComment({});
      setCurrentCommentId(null);
      setContent(""); // "Text" 영역 초기화
    },
    [content, dispatch, post.id, setContent]
  );

  const prevContent = content.replace(/<br\s*\/?>/gi, "\n");

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReComment, setAddReComment] = useState<Record<string, boolean>>({});

  const onAddReCommentForm = useCallback((commentId: number) => {
    setAddReComment((prev) => {
      const newReCommentState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newReCommentState[key] = false;
      });
      newReCommentState[commentId] = !prev[commentId];
      return newReCommentState;
    });
  }, []);

  //---댓글 삭제-----------------------------------------------------
  const onRemoveComment = useCallback(
    (commentId: number) => {
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

  //OutsideClick----------------------------------------------
  const popupRef = useRef<HTMLDivElement>(null);
  const reCommentFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([popupRef, reCommentFormRef, editCommentRef], () => {
    setShowinfo({});
    setAddReComment({});
    setEditComment({});
  });

  return (
    <>
      {removeCommentLoading || updateCommentLoading || addReCommentLoading ? (
        <Spinner />
      ) : null}
      {post.Comments.map((comment) => {
        const isEditing = editComment[comment.id];
        return (
          <div key={comment.id}>
            <FullCommentWrapper key={comment.id}>
              <AuthorWrapper>
                <Author onClick={() => toggleShowInfo(comment.id)}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>{comment.User.nickname.slice(0, 5)}</span>
                </Author>
                {showInfo[comment.id] ? (
                  <PopupMenu ref={popupRef}>
                    <BlueButton onClick={() => onSearch(comment.User.nickname)}>
                      작성 글 보기
                    </BlueButton>
                  </PopupMenu>
                ) : null}
                <Date>({moment(comment.createdAt).format("l")})</Date>
              </AuthorWrapper>
              <ContentWrapper>
                {isEditing && currentCommentId === comment.id ? (
                  <>
                    <Textarea
                      value={prevContent}
                      onChange={onChangeContent}
                      ref={editCommentRef}
                    />
                    <ButtonContainer>
                      <BlueButton onClick={() => onModifytComment(comment.id)}>
                        수정
                      </BlueButton>
                      <BlueButton onClick={onCancelEditComment}>
                        취소
                      </BlueButton>
                    </ButtonContainer>
                  </>
                ) : (
                  <Content>
                    <ContentRenderer content={comment.content} />
                  </Content>
                )}
                <CommentOptions>
                  {id && (
                    <Button onClick={() => onAddReCommentForm(comment.id)}>
                      <FontAwesomeIcon icon={faComment} />
                    </Button>
                  )}
                  {id === comment.User.id || nickname === "admin" ? (
                    <>
                      <Button
                        onClick={() =>
                          onEditCommentForm(comment.id, comment.content)
                        }
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      <Button
                        onClick={() =>
                          onRemoveComment(
                            comment.id /*매개변수를 위의 함수로 전달*/
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </>
                  ) : null}
                </CommentOptions>
              </ContentWrapper>
              {addReComment[comment.id] && (
                <div ref={reCommentFormRef}>
                  <ReCommentForm
                    post={post}
                    comment={comment}
                    reComment={null}
                    setAddReComment={setAddReComment}
                  />
                </div>
              )}
              <ReComment post={post} comment={comment} />
            </FullCommentWrapper>
          </div>
        );
      })}
    </>
  );
};

export default Comment;

const FullCommentWrapper = styled.div`
  border-top: 1px solid silver;
  font-size: 15px;
`;

const AuthorWrapper = styled.div`
  position: relative;
  margin-top: 15px;
`;

const Author = styled.button`
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
  color: ${(props) => props.theme.mainColor};
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: end;
`;

const Content = styled.div`
  /**내용 수직 정렬용 */
  width: 90%;
  font-size: 0.8rem;
  display: flex;
  word-break: break-word; /**텍스트 줄바꿈 */
`;

const Button = styled.button`
  font-weight: bold;
`;

const CommentOptions = styled.div`
  display: flex;
  height: 30px;
  & * {
    margin-left: 2px;
  }
`;

const Date = styled.span`
  color: gray;
  font-size: 12px;
  @media (max-width: 480px) {
    width: 20%;
  }
`;

const ButtonContainer = styled.div`
  height: 30px;
`;
const BlueButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  font-size: 12px;
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

const Textarea = styled.textarea`
  max-width: 80%;
  min-width: 80%;
  margin: 0 auto;
  padding: 12px;
  font-size: 0.8rem;
  @media (max-width: 480px) {
    font-size: 0.8rem;
    width: 55%;
  }
`;

const PopupMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
