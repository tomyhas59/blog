import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../../types";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../pages/Info/MyInfo";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { usePagination } from "../../hooks/PaginationProvider";
import useSetParams from "../../hooks/useSetParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import FollowButton from "../ui/FollowButton";
import UserPageButton from "../ui/UserPageButton";
import { formatDate } from "../../utils/date";

const Post = ({
  post,
  postId,
  viewedPosts,
}: {
  post: PostType;
  viewedPosts?: number[];
  postId?: number;
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
      params.set("page", currentPage.toString());
      params.set("sortBy", sortBy.toString());
      params.set("cPage", "1");
      navigator({
        pathname: `/post/${postId}`,
        search: params.toString(),
      });
      window.scrollTo({ top: 0, behavior: "auto" });
      setCurrentCommentsPage(1);
    },
    [currentPage, navigator, sortBy, setCurrentCommentsPage]
  );

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showAuthorMenu, setShowAuthorMenu] = useState<boolean | {}>(false);
  const toggleShowAuthorMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowAuthorMenu((prev) => !prev);
    },
    []
  );

  //OutsideClick----------------------------------------------
  const authorMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef], () => {
    setShowAuthorMenu(false);
  });

  const setParams = useSetParams({
    searchOption: "author",
    page: 1,
  });

  const searchByNickname = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchedCurrentPage(1);
      setParams({ searchText: post.User.nickname });
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [post.User.nickname, setSearchedCurrentPage, setParams]
  );

  const totalRepliesCount = post.Comments.reduce(
    (total, comment) => total + comment.Replies?.length,
    0
  );

  return (
    <PostContainer
      onClick={() => goToPostDetail(post.id)}
      isActive={postId === post.id}
    >
      <PostHeaderLeftSection>
        <NicknameButton onClick={toggleShowAuthorMenu}>
          <img
            src={
              post.User.Image
                ? `${baseURL}/${post.User.Image.src}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
            alt="유저 이미지"
          />
          <Nickname>{post.User.nickname.slice(0, 5)}</Nickname>
        </NicknameButton>
        {showAuthorMenu && (
          <AuthorMenu ref={authorMenuRef}>
            <StyledButton onClick={searchByNickname}>작성 글 보기</StyledButton>
            <UserPageButton userId={post.User.id} />
            {id !== post.User.id && (
              <FollowButton
                userId={post.User.id}
                setShowAuthorMenu={setShowAuthorMenu}
              />
            )}
          </AuthorMenu>
        )}
        <PostTitle isViewed={viewedPosts?.includes(post.id) as boolean}>
          {post.title}
          <span style={{ fontSize: "12px" }}>
            [{post.Comments.length + totalRepliesCount}]
          </span>
          <span>
            {post.Images.length > 0 && (
              <FontAwesomeIcon
                icon={post.Images.length === 1 ? faImage : faImages}
              />
            )}
          </span>
        </PostTitle>
      </PostHeaderLeftSection>
      <PostMetaInfo>
        <Date>{formatDate(post.createdAt)}</Date>
        <Liked>{post.Likers.length === 0 ? "" : post.Likers.length}</Liked>
        <ViewCount>{post.viewCount}</ViewCount>
      </PostMetaInfo>
    </PostContainer>
  );
};

export default Post;

const PostContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  padding: 5px 10px;
  margin: 0 auto;
  border: 1px solid #f4f4f4;
  background-color: ${(props) =>
    props.isActive ? props.theme.activeColor : props.theme.backgroundColor};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.mainColor};
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PostHeaderLeftSection = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PostTitle = styled.div<{ isViewed: boolean }>`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${(props) => (props.isViewed ? "#b0b0b0" : props.theme.textColor)};
`;

export const NicknameButton = styled.button`
  display: flex;
  justify-content: start;
  align-items: center;
  color: ${(props) => props.theme.mainColor};
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  img {
    display: inline;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const AuthorMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 50px;
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

export const StyledButton = styled.button`
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

export const Nickname = styled.span`
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  text-align: start;
  width: 52px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const PostMetaInfo = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  align-self: flex-end;
  gap: 5px;
`;

export const Date = styled.span`
  font-size: 12px;
  color: silver;
`;

export const Liked = styled.span`
  color: red;
  font-weight: bold;
  min-width: 20px;
`;

export const ViewCount = styled.span`
  color: silver;
  min-width: 20px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
