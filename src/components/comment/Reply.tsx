import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_REPLY_REQUEST } from "../../reducer/post";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faComment } from "@fortawesome/free-solid-svg-icons";
import { CommentType, PostType } from "../../types";
import { RootState } from "../../reducer";
import ReplyForm from "./ReplyForm";
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

const Reply = ({ post, comment }: { post: PostType; comment: CommentType }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const { removeReplyLoading, updateReplyLoading } = useSelector(
    (state: RootState) => state.post
  );
  const { setSearchedCurrentPage } = usePagination();
  const [showAuthorMenu, setShowAuthorMenu] = useState<Record<number, boolean>>(
    {}
  );

  const toggleShowAuthorMenu = useCallback((replyId: number) => {
    setShowAuthorMenu((prev) => {
      const updatedPopupState: Record<number, boolean> = { ...prev };
      for (const key in updatedPopupState) {
        updatedPopupState[key] = false;
      }
      updatedPopupState[replyId] = !prev[replyId];
      return updatedPopupState;
    });
  }, []);

  //대댓글 쓰기 창,map 안에서 하나만 작동 및 폼 중복 방지 코드---------------------
  const [addReply, setAddReply] = useState<Record<string, boolean>>({});

  const showReplyForm = useCallback((replyId: number) => {
    setAddReply((prev) => {
      const newReplyState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newReplyState[key] = false;
      });
      newReplyState[replyId] = !prev[replyId];
      return newReplyState;
    });
  }, []);

  //---대댓글 삭제----------------------------------------
  const handleRemoveReply = useCallback(
    (replyId: number) => {
      if (!window.confirm("삭제하시겠습니까?")) return false;
      dispatch({
        type: REMOVE_REPLY_REQUEST,
        data: {
          postId: post.id,
          replyId: replyId,
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
  const replyFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef, replyFormRef], () => {
    setShowAuthorMenu({});
    setAddReply({});
  });

  return (
    <>
      {removeReplyLoading || updateReplyLoading ? <Spinner /> : null}
      {comment.Replies?.map((reply) => {
        const regex = /@\w+/g;
        const regexNickname = reply.content.match(regex);
        const userNickname = regexNickname && regexNickname[0].replace("@", "");
        const userContent = reply.content.replace(regex, "");

        return (
          <ReplyContainer key={reply.id}>
            <ReplyHeader>
              <Author onClick={() => toggleShowAuthorMenu(reply.id)}>
                ↪
                <img
                  src={
                    reply.User.Image
                      ? `${baseURL}/${reply.User.Image.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="유저 이미지"
                />
                {reply.User.nickname.slice(0, 5)}
              </Author>
              {showAuthorMenu[reply.id] ? (
                <AuthorMenu ref={authorMenuRef}>
                  <BlueButton
                    onClick={() => searchByNickname(reply.User.nickname)}
                  >
                    작성 글 보기
                  </BlueButton>
                  <UserPageButton userId={reply.User.id} />
                  {id !== reply.User.id && (
                    <FollowButton
                      userId={reply.User.id}
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
              <Date>{formatDate(reply.createdAt)}</Date>
              <Like itemType="reply" item={reply} commentId={comment.id} />
            </ReplyHeader>
            <ContentWrapper>
              <Content id={`reply-content-${reply.id}`}>
                <span>{userNickname}</span>
                <ContentRenderer content={userContent} />
              </Content>
              <ReplyOptions>
                {id && (
                  <Button onClick={() => showReplyForm(reply.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </Button>
                )}

                {id === reply.User.id || nickname === "admin" ? (
                  <Button onClick={() => handleRemoveReply(reply.id)}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </Button>
                ) : null}
              </ReplyOptions>
            </ContentWrapper>
            {addReply[reply.id] && (
              <div ref={replyFormRef}>
                <ReplyForm
                  post={post}
                  comment={comment}
                  reply={reply}
                  setAddReply={setAddReply}
                />
              </div>
            )}
          </ReplyContainer>
        );
      })}
    </>
  );
};
export default Reply;

const ReplyContainer = styled.div`
  width: 90%;
  padding: 5px;
  margin: 0 auto;
  border-top: 1px solid silver;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const ReplyHeader = styled.div`
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

const ReplyOptions = styled.div`
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
