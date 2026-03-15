import React, { useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faComment } from "@fortawesome/free-solid-svg-icons";

// Reducer & Types
import { REMOVE_REPLY_REQUEST } from "../../../reducer/post";
import { CommentType, PostType } from "../../../types";
import { RootState } from "../../../reducer";

// Hooks & Utils
import useOutsideClick from "../../../hooks/useOutsideClick";
import { usePagination } from "../../../hooks/PaginationProvider";
import useSetParams from "../../../hooks/useSetParams";
import { formatDate } from "../../../utils/date";
import { baseURL } from "../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../pages/Info/MyInfo";

// Components
import ReplyForm from "../ReplyForm";
import Spinner from "../../ui/Spinner";
import ContentRenderer from "../../renderer/ContentRenderer";
import FollowButton from "../../ui/FollowButton";
import Like from "../../ui/Like";
import UserPageButton from "../../ui/UserPageButton";

import * as S from "./ReplyStyles";

const Reply = ({ post, comment }: { post: PostType; comment: CommentType }) => {
  const dispatch = useDispatch();

  // --- Selectors (기존 변수명 유지) ---
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const { removeReplyLoading, updateReplyLoading } = useSelector(
    (state: RootState) => state.post,
  );

  const { setSearchedCurrentPage } = usePagination();

  // --- Logic 1: Author Menu (기존 로직 유지) ---
  const [showAuthorMenu, setShowAuthorMenu] = useState<Record<number, boolean>>(
    {},
  );
  const toggleAuthorMenu = useCallback((replyId: number) => {
    setShowAuthorMenu((prev) => ({ [replyId]: !prev[replyId] }));
  }, []);

  const setParams = useSetParams({ searchOption: "author", page: 1 });
  const searchByNickname = useCallback(
    (userNickname: string) => {
      setSearchedCurrentPage(1);
      setParams({ searchText: userNickname });
      setShowAuthorMenu({});
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [setSearchedCurrentPage, setParams],
  );

  // --- Logic 2: Reply Form Control (기존 로직 유지) ---
  const [addReply, setAddReply] = useState<Record<string, boolean>>({});
  const toggleReplyForm = useCallback((replyId: number) => {
    setAddReply((prev) => ({ [replyId]: !prev[replyId] }));
  }, []);

  // --- Logic 3: Remove Reply (기존 로직 유지) ---
  const onRemoveReply = useCallback(
    (replyId: number) => {
      if (window.confirm("삭제하시겠습니까?")) {
        dispatch({
          type: REMOVE_REPLY_REQUEST,
          data: { postId: post.id, replyId, commentId: comment.id },
        });
      }
    },
    [comment.id, dispatch, post.id],
  );

  // --- Logic 4: Outside Click (기존 로직 유지) ---
  const authorMenuRef = useRef<HTMLDivElement>(null);
  const replyFormRef = useRef<HTMLDivElement>(null);
  useOutsideClick([authorMenuRef, replyFormRef], () => {
    setShowAuthorMenu({});
    setAddReply({});
  });

  return (
    <S.NestedSection>
      {(removeReplyLoading || updateReplyLoading) && <Spinner />}

      {comment.Replies?.map((reply) => {
        // 기존 멘션 추출 로직 유지
        const regex = /@\w+/g;
        const regexNickname = reply.content.match(regex);
        const mentionName = regexNickname && regexNickname[0];
        const pureContent = reply.content.replace(regex, "");

        return (
          <S.ReplyCard key={reply.id}>
            <S.ReplyHeader>
              <S.UserInfo>
                <S.AuthorBox onClick={() => toggleAuthorMenu(reply.id)}>
                  <span className="reply-icon">↪</span>
                  <img
                    src={
                      reply.User.Image
                        ? `${baseURL}/${reply.User.Image.src}`
                        : DEFAULT_PROFILE_IMAGE
                    }
                    alt="user"
                  />
                  <span>{reply.User.nickname.slice(0, 5)}</span>
                </S.AuthorBox>
                <S.Timestamp>{formatDate(reply.createdAt)}</S.Timestamp>
              </S.UserInfo>

              {showAuthorMenu[reply.id] && (
                <S.PopoverMenu ref={authorMenuRef}>
                  <S.BrandButton
                    onClick={() => searchByNickname(reply.User.nickname)}
                  >
                    작성 글 보기
                  </S.BrandButton>
                  <UserPageButton userId={reply.User.id} />
                  {id !== reply.User.id && (
                    <FollowButton
                      userId={reply.User.id}
                      setShowAuthorMenu={setShowAuthorMenu as any}
                    />
                  )}
                </S.PopoverMenu>
              )}
              <Like itemType="reply" item={reply} commentId={comment.id} />
            </S.ReplyHeader>

            <S.ReplyBody>
              <S.MessageText>
                {mentionName && <span className="mention">{mentionName}</span>}
                <ContentRenderer content={pureContent} />
              </S.MessageText>

              <S.ActionTray>
                {id && (
                  <S.IconButton onClick={() => toggleReplyForm(reply.id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </S.IconButton>
                )}
                {(id === reply.User.id || nickname === "admin") && (
                  <S.IconButton
                    variant="danger"
                    onClick={() => onRemoveReply(reply.id)}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </S.IconButton>
                )}
              </S.ActionTray>
            </S.ReplyBody>

            {addReply[reply.id] && (
              <div ref={replyFormRef} style={{ marginTop: "12px" }}>
                <ReplyForm
                  post={post}
                  comment={comment}
                  reply={reply}
                  setAddReply={setAddReply}
                />
              </div>
            )}
          </S.ReplyCard>
        );
      })}
    </S.NestedSection>
  );
};

export default Reply;
