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
import { usePagination } from "../pages/PaginationProvider";
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

  const { currentPage, setSearchedCurrentPage, sortBy } = usePagination();

  const goToPostDetail = useCallback(
    (postId: number) => {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("sortBy", sortBy.toString());
      navigator({
        pathname: `/post/${postId}`,
        search: params.toString(),
      });
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [currentPage, navigator, sortBy, postId]
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
  background-color: ${(props) => (props.isActive ? "#e0f7fa" : "#fff")};

  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isActive ? "#b2ebf2" : "#f4f4f4")};
  }
`;

const PostHeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 10px;
`;

const PostTitle = styled.div<{ isViewed: boolean }>`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${(props) => (props.isViewed ? "#b0b0b0" : "black")};
  &:hover {
    color: #007bff;
  }
`;

const NicknameButton = styled.button`
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

const Button = styled.button`
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

const Nickname = styled.span`
  width: 50px;
  text-align: start;
`;

const PostInfo = styled.div`
  font-size: 12px;
  color: silver;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Date = styled.span`
  font-size: 12px;
  color: silver;
`;

const Liked = styled.span`
  color: red;
  font-weight: bold;
  min-width: 30px;
`;

const ViewCount = styled.span`
  color: silver;
  min-width: 30px;
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
