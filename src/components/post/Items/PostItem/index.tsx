import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";

import { PostType } from "../../../../types";
import { RootState } from "../../../../reducer";
import { baseURL } from "../../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../../pages/Info/MyInfo";
import { usePagination } from "../../../../hooks/PaginationProvider";
import useSetParams from "../../../../hooks/useSetParams";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { formatDate } from "../../../../utils/date";

// 공통 스타일 및 전용 스타일 import
import * as S from "./PostItemStyles";
import * as CS from "../../PostCommonStyles"; // 처음에 만든 공통 스타일
import FollowButton from "../../../ui/FollowButton";
import UserPageButton from "../../../ui/UserPageButton";

const PostItem = ({
  post,
  postId,
  viewedPosts,
  hashtagName,
}: {
  post: PostType;
  viewedPosts?: number[];
  postId?: number;
  hashtagName?: string;
}) => {
  const navigator = useNavigate();
  const me = useSelector((state: RootState) => state.user.me);
  const id = me?.id;

  const {
    currentPage,
    setSearchedCurrentPage,
    sortBy,
    setCurrentCommentsPage,
  } = usePagination();

  const goToPostDetail = useCallback(
    (postId: number) => {
      const params = new URLSearchParams();
      if (hashtagName) {
        params.set("hashtagName", hashtagName);
      } else {
        params.set("sortBy", sortBy.toString());
      }
      params.set("page", currentPage.toString());
      params.set("cPage", "1");

      const pathname = hashtagName
        ? `/hashtagPost/${postId}`
        : `/post/${postId}`;

      navigator({ pathname, search: params.toString() });
      window.scrollTo({ top: 0, behavior: "auto" });
      setCurrentCommentsPage(1);
    },
    [currentPage, navigator, sortBy, setCurrentCommentsPage, hashtagName],
  );

  const [showAuthorMenu, setShowAuthorMenu] = useState<boolean | {}>(false);

  const toggleShowAuthorMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowAuthorMenu((prev) => !prev);
    },
    [],
  );
  const authorMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef], () => setShowAuthorMenu(false));

  const setParams = useSetParams({ searchOption: "author", page: 1 });

  const searchByNickname = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchedCurrentPage(1);
      setParams({ searchText: post.User.nickname });
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [post.User.nickname, setSearchedCurrentPage, setParams],
  );

  const totalRepliesCount = post.Comments.reduce(
    (total, comment) => total + (comment.Replies?.length || 0),
    0,
  );

  return (
    <S.PostContainer
      onClick={() => goToPostDetail(post.id)}
      isActive={postId === post.id}
    >
      <CS.PostHeaderLeftSection>
        <S.NicknameButton onClick={toggleShowAuthorMenu}>
          <img
            src={
              post.User.Image
                ? `${baseURL}/${post.User.Image.src}`
                : DEFAULT_PROFILE_IMAGE
            }
            alt="유저"
          />
          <S.Nickname>{post.User.nickname.slice(0, 5)}</S.Nickname>
        </S.NicknameButton>

        {showAuthorMenu && (
          <S.AuthorMenu ref={authorMenuRef}>
            <CS.StyledButton onClick={searchByNickname}>
              작성 글 보기
            </CS.StyledButton>
            <UserPageButton userId={post.User.id} />
            {id !== post.User.id && (
              <FollowButton
                userId={post.User.id}
                setShowAuthorMenu={setShowAuthorMenu}
              />
            )}
          </S.AuthorMenu>
        )}

        <S.PostTitle isViewed={viewedPosts?.includes(post.id) as boolean}>
          {post.title}
          <span className="comment-count">
            [{post.Comments.length + totalRepliesCount}]
          </span>
          {post.Images.length > 0 && (
            <span className="icon-preview">
              <FontAwesomeIcon
                icon={post.Images.length === 1 ? faImage : faImages}
              />
            </span>
          )}
        </S.PostTitle>
      </CS.PostHeaderLeftSection>

      <CS.PostMetaInfo>
        <CS.Date>{formatDate(post.createdAt)}</CS.Date>
        <S.Liked>{post.Likers.length || ""}</S.Liked>
        <CS.ViewCount>{post.viewCount}</CS.ViewCount>
      </CS.PostMetaInfo>
    </S.PostContainer>
  );
};

export default PostItem;
