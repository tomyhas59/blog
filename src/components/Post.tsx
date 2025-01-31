import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../types";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import useOutsideClick from "../hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import FollowButton from "./FollowButton";
import { usePagination } from "../hooks/PaginationProvider";
import useSetParams from "../hooks/useSetParams";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";

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
  const [showInfo, setShowInfo] = useState<boolean | {}>(false);
  const toggleShowInfo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowInfo((prevShowInfo) => !prevShowInfo);
    },
    []
  );

  //OutsideClick----------------------------------------------
  const infoMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick([infoMenuRef], () => {
    setShowInfo(false);
  });

  const setParams = useSetParams({
    searchOption: "author",
    page: 1,
  });

  const onSearch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchedCurrentPage(1);
      setParams({ searchText: post.User.nickname });
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [post.User.nickname, setSearchedCurrentPage, setParams]
  );

  const totalReComments = post.Comments.reduce(
    (total, comment) => total + comment.ReComments.length,
    0
  );

  return (
    <PostContainer
      onClick={() => goToPostDetail(post.id)}
      isActive={postId === post.id}
    >
      <PostHeaderFlex>
        <NicknameButton onClick={toggleShowInfo}>
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
        {showInfo && (
          <InfoMenu ref={infoMenuRef}>
            <Button onClick={onSearch}>작성 글 보기</Button>
            {id !== post.User.id && (
              <FollowButton userId={post.User.id} setShowInfo={setShowInfo} />
            )}
          </InfoMenu>
        )}
        <PostTitle isViewed={viewedPosts?.includes(post.id) as boolean}>
          {post.title}
          <span style={{ fontSize: "12px" }}>
            [{post.Comments.length + totalReComments}]
          </span>
          <span>
            {post.Images.length > 0 && (
              <FontAwesomeIcon
                icon={post.Images.length === 1 ? faImage : faImages}
              />
            )}
          </span>
        </PostTitle>
      </PostHeaderFlex>
      <PostInfo>
        <Date>{moment(post.createdAt).format("l")}</Date>
        <Liked>{post.Likers.length === 0 ? "" : post.Likers.length}</Liked>
        <ViewCount>{post.viewCount}</ViewCount>
      </PostInfo>
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
    background-color: ${(props) => props.theme.activeColor};
  }
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const PostHeaderFlex = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 10px;
  @media (max-width: 480px) {
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
  &:hover {
    color: #007bff;
  }
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

const InfoMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 50px;
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

export const Button = styled.button`
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
    color: ${(props) => props.theme.hoverMainColor};
  }
`;

export const Nickname = styled.span`
  color: ${(props) => props.theme.charColor};
  font-weight: bold;
  text-align: start;
  width: 50px;
`;

export const PostInfo = styled.div`
  font-size: 12px;
  color: silver;
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
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
