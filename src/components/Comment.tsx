import React, { ChangeEvent, useCallback, useRef, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PostType } from "../types";
import { RootState } from "../reducer";
import Spinner from "./Spinner";
import ContentRenderer from "./renderer/ContentRenderer";
import useOutsideClick from "../hooks/useOutsideClick";
import useTextareaAutoHeight from "../hooks/useTextareaAutoHeight";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../pages/PaginationProvider";
import useSetParams from "../hooks/useSetParams";
const Comment = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const { removeCommentLoading, updateCommentLoading, addReCommentLoading } =
    useSelector((state: RootState) => state.post);
  const navigator = useNavigate();
  const { searchedPaginate } = usePagination();

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showInfo, setShowInfo] = useState<Record<number, boolean>>({});

  const toggleShowInfo = useCallback((commentId: number) => {
    setShowInfo((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[commentId] = !prev[commentId];
      return updatedPopupState;
    });
  }, []);

  const setParams = useSetParams({
    searchOption: "author",
    page: 1,
  });

  const onSearch = useCallback(
    (userNickname: string) => {
      searchedPaginate(1);
      setParams({ searchText: userNickname });
      setShowInfo({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, navigator]
  );
  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState<Record<number, boolean>>({});
  const [content, , setContent] = useInput();

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

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
  const onCancelEditComment = () => {
    setEditComment({});
    setCurrentCommentId(null);
    setContent(""); // "Text" 영역 초기화
  };

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
    setShowInfo({});
    setAddReComment({});
    setEditComment({});
  });

  return (
    <>
      {(removeCommentLoading ||
        updateCommentLoading ||
        addReCommentLoading) && <Spinner />}
      {post.Comments?.map((comment) => {
        const isEditing = editComment[comment.id];
        return (
          <div key={comment.id}>
            <FullCommentWrapper key={comment.id}>
              <AuthorWrapper>
                <Author onClick={() => toggleShowInfo(comment.id)}>
                  <img
                    src={
                      comment.User.Image
                        ? `${baseURL}/${comment.User.Image.src}`
                        : `${DEFAULT_PROFILE_IMAGE}`
                    }
                    alt="유저 이미지"
                  />
                  <span>{comment.User.nickname.slice(0, 5)}</span>
                </Author>
                {showInfo[comment.id] ? (
                  <PopupMenu ref={popupRef}>
                    <BlueButton onClick={() => onSearch(comment.User.nickname)}>
                      작성 글 보기
                    </BlueButton>
                    {id !== comment.User.id && (
                      <FollowButton
                        userId={comment.User.id}
                        setShowInfo={
                          setShowInfo as React.Dispatch<
                            React.SetStateAction<
                              boolean | Record<number, boolean>
                            >
                          >
                        }
                      />
                    )}
                  </PopupMenu>
                ) : null}
                <Date>{moment(comment.createdAt).format("l")}</Date>
              </AuthorWrapper>
              <ContentWrapper>
                {isEditing && currentCommentId === comment.id ? (
                  <Textarea
                    value={prevContent}
                    onChange={onChangeContent}
                    ref={editCommentRef}
                  />
                ) : (
                  <Content id={`comment-${comment.id}`}>
                    <ContentRenderer content={comment.content} />
                  </Content>
                )}
                {isEditing && currentCommentId === comment.id && (
                  <ButtonContainer>
                    <BlueButton onClick={() => onModifytComment(comment.id)}>
                      수정
                    </BlueButton>
                    <BlueButton onClick={onCancelEditComment}>취소</BlueButton>
                  </ButtonContainer>
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
  img {
    display: inline;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }

  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const ContentWrapper = styled.div`
  padding: 5px;
  justify-content: space-between;
  align-items: end;
`;

const Content = styled.div`
  width: 90%;
  font-size: 0.8rem;
  display: flex;
`;

const Textarea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  margin: 0 auto;
  padding: 12px;
  font-size: 0.8rem;
`;

const ButtonContainer = styled.div`
  height: 30px;
  text-align: center;
`;
const CommentOptions = styled.div`
  display: flex;

  height: 30px;
  justify-content: flex-end;
  & * {
    margin-left: 2px;
  }
`;

const Button = styled.button`
  font-weight: bold;
`;

const Date = styled.span`
  color: gray;
  font-size: 12px;
  @media (max-width: 480px) {
    width: 20%;
  }
`;

const BlueButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
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

const PopupMenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 30px;
  left: 0;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
