import React, { useCallback, useEffect, useRef, useState } from "react";
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
const Comment = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);

  //----------작성글 보기 팝업-------------------------------------
  const [showPopup, setShowPopup] = useState<Record<number, boolean>>({});

  const handlePopupToggle = useCallback((commentId: number) => {
    setShowPopup((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[commentId] = !prev[commentId];
      return updatedPopupState;
    });
  }, []);

  const handleSearch = useCallback(
    (userNickname: string) => {
      dispatch({
        type: SEARCH_NICKNAME_REQUEST,
        query: userNickname,
      });
      setShowPopup({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch]
  );

  //------------------댓글 수정--------------------------------

  const [editComment, setEditComment] = useState<Record<number, boolean>>({});
  const [content, contentOnChane, setContent] = useInput();
  const textRef = useRef(null);

  // 현재 열려 있는 댓글의 id추적하기 위한 상태 변수
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  const onEditReCommentHandler = useCallback(
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

  // "취소" 버튼을 누를 때 호출되는 함수
  const handleCancelEdit = useCallback(() => {
    setEditComment((prev) => ({
      ...prev,
      [currentCommentId as number]: false,
    }));
    setCurrentCommentId(null);
    setContent(""); // "Text" 영역 초기화
  }, [currentCommentId, setContent]);

  const handleModifyComment = useCallback(
    (commentId: number) => {
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
    (e: React.KeyboardEvent<HTMLInputElement>, commentId: number) => {
      if (e.key === "Enter") {
        handleModifyComment(commentId);
      }
    },
    [handleModifyComment]
  );

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReComment, setAddReComment] = useState<Record<string, boolean>>({});

  const onAddReCommentHandler = useCallback((commentId: number) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

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
                  <PopupMenu ref={popupRef}>
                    <Button onClick={() => handleSearch(comment.User.nickname)}>
                      작성 글 보기
                    </Button>
                  </PopupMenu>
                ) : null}
                {isEditing && currentCommentId === comment.id ? (
                  <>
                    <Input
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
                <CommentOptions>
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
                          onEditReCommentHandler(comment.id, comment.content)
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
                </CommentOptions>
              </CommentWrapper>
              <ReComment post={post} comment={comment} />
            </FullCommentWrapper>
            {addReComment[comment.id] ? (
              <ReCommentForm
                post={post}
                comment={comment}
                setAddReComment={setAddReComment}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default Comment;

const FullCommentWrapper = styled.div`
  border-bottom: 1px solid silver;
  font-size: 15px;
`;

const CommentWrapper = styled.div`
  display: flex;
  width: 100%;
  border-radius: 5px;
  padding: 5px;
  position: relative;
`;

const Author = styled.button`
  font-weight: bold;
  width: 10%;
  text-align: center;
  margin-right: 10px;
`;

const Content = styled.div`
  width: 65%;
  /**내용 수직 정렬용 */
  display: flex;
  align-items: center;
`;

const Toggle = styled.button`
  font-weight: bold;
`;

const CommentOptions = styled.div`
  display: flex;
  & * {
    margin-left: 2px;
  }
`;

const Date = styled.button`
  cursor: default;
  color: gray;
  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

const NotLoggedIn = styled.button`
  font-weight: bold;
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

const Input = styled.input`
  width: 60%;
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
