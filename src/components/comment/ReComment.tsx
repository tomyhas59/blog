import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_RECOMMENT_REQUEST } from "../../reducer/post";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faComment } from "@fortawesome/free-solid-svg-icons";
import { CommentType, PostType } from "../../types";
import { RootState } from "../../reducer";
import ReCommentForm from "./ReCommentForm";
import Spinner from "../ui/Spinner";
import ContentRenderer from "../renderer/ContentRenderer";
import useOutsideClick from "../../hooks/useOutsideClick";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../pages/Info/MyInfo";
import FollowButton from "../ui/FollowButton";
import { usePagination } from "../../hooks/PaginationProvider";
import useSetParams from "../../hooks/useSetParams";
import Like from "../ui/Like";
import UserPageButton from "../ui/UserPageButton";
import { formatDate } from "../../utils/date";

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
  const { setSearchedCurrentPage } = usePagination();
  const [showAuthorMenu, setShowAuthorMenu] = useState<Record<number, boolean>>(
    {}
  );

  const toggleShowAuthorMenu = useCallback((ReCommentId: number) => {
    setShowAuthorMenu((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[ReCommentId] = !prev[ReCommentId];
      return updatedPopupState;
    });
  }, []);

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReComment, setAddReComment] = useState<Record<string, boolean>>({});

  const showReCommentForm = useCallback((reCommentId: number) => {
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
  const handleRemoveReComment = useCallback(
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

  const setParams = useSetParams({
    searchOption: "author",
    page: 1,
  });

  const searchByNickname = useCallback(
    (userNickname: string) => {
      setSearchedCurrentPage(1);
      setParams({ searchText: userNickname });
      setShowAuthorMenu({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [setSearchedCurrentPage, setParams]
  );

  //OutsideClick----------------------------------------------
  const authorMenuRef = useRef<HTMLDivElement>(null);
  const reCommentFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef, reCommentFormRef], () => {
    setShowAuthorMenu({});
    setAddReComment({});
  });

  return (
    <>
      {removeReCommentLoading || updateReCommentLoading ? <Spinner /> : null}
      {comment.ReComments?.map((reComment) => {
        const regex = /@\w+/g;
        const regexNickname = reComment.content.match(regex);
        const userNickname = regexNickname && regexNickname[0].replace("@", "");
        const userContent = reComment.content.replace(regex, "");

        return (
          <ReCommentContainer key={reComment.id}>
            <ReCommentHeader>
              <Author onClick={() => toggleShowAuthorMenu(reComment.id)}>
                ↪
                <img
                  src={
                    reComment.User.Image
                      ? `${baseURL}/${reComment.User.Image.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="유저 이미지"
                />
                {reComment.User.nickname.slice(0, 5)}
              </Author>
              {showAuthorMenu[reComment.id] ? (
                <AuthorMenu ref={authorMenuRef}>
                  <BlueButton
                    onClick={() => searchByNickname(reComment.User.nickname)}
                  >
                    작성 글 보기
                  </BlueButton>
                  <UserPageButton userId={reComment.UserId} />
                  {id !== reComment.User.id && (
                    <FollowButton
                      userId={reComment.User.id}
                      setShowAuthorMenu={
                        setShowAuthorMenu as React.Dispatch<
                          React.SetStateAction<
                            boolean | Record<number, boolean>
                          >
                        >
                      }
                    />
                  )}
                </AuthorMenu>
              ) : null}
              <Date>{formatDate(reComment.createdAt)}</Date>
              <Like
                itemType="reComment"
                item={reComment}
                commentId={comment.id}
              />
            </ReCommentHeader>
            <ContentWrapper>
              <Content id={`reComment-content-${reComment.id}`}>
                <span>{userNickname}</span>
                <ContentRenderer content={userContent} />
              </Content>
              <ReCommentOptions>
                {id && (
                  <Button onClick={() => showReCommentForm(reComment.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </Button>
                )}

                {id === reComment.User.id || nickname === "admin" ? (
                  <Button onClick={() => handleRemoveReComment(reComment.id)}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </Button>
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
          </ReCommentContainer>
        );
      })}
    </>
  );
};
export default ReComment;

const ReCommentContainer = styled.div`
  width: 90%;
  padding: 5px;
  margin: 0 auto;
  border-top: 1px solid silver;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const ReCommentHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Author = styled.button`
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
  color: ${(props) => props.theme.textColor};
  transition: transform 0.3s ease, color 0.3s ease;
  img {
    display: inline;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const ContentWrapper = styled.div`
  padding: 5px;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 90%;
  font-size: 0.8rem;
  & span {
    color: #b3b0b0;
  }
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Button = styled.button`
  font-size: 10px;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.hoverMainColor};
  }
`;

const Date = styled.span`
  color: gray;
  font-size: 10px;
`;

const ReCommentOptions = styled.div`
  display: flex;
  & * {
    margin-left: 2px;
  }
`;

const AuthorMenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 30px;
  left: 0;
  transition: transform 0.3s ease, color 0.3s ease;
  z-index: 999;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
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
