import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../types";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import useOutsideClick from "../hooks/useOutsideClick";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer";
import FollowButton from "./FollowButton";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { usePagination } from "../pages/PaginationProvider";

const Post = ({ post, postId }: { post: PostType; postId?: number }) => {
  const navigator = useNavigate();
  const me = useSelector((state: RootState) => state.user.me);
  const id = me?.id;

  const { currentPage, searchedPostsPerPage, searchedPaginate } =
    usePagination();

  const goToPostDetail = useCallback(
    (postId: number) => {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      navigator({
        pathname: `/post/${postId}`,
        search: params.toString(),
      });
    },
    [currentPage, navigator]
  );
  const dispatch = useDispatch();

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

  const setParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("searchText", post.User.nickname);
    params.set("searchOption", "author");
    params.set("page", "1");

    navigator({
      pathname: `/search`,
      search: params.toString(),
    });
  }, [navigator, post.User.nickname]);

  const onSearch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: post.User.nickname,
        searchOption: "author",
        page: 1,
        limit: searchedPostsPerPage,
      });
      searchedPaginate(1);
      setParams();
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [
      dispatch,
      post.User.nickname,
      searchedPaginate,
      searchedPostsPerPage,
      setParams,
    ]
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
        <PostTitle>
          {post.title}
          <span style={{ fontSize: "12px" }}>
            [{post.Comments.length + totalReComments}]
          </span>
        </PostTitle>
      </PostHeaderFlex>
    </PostContainer>
  );
};

export default Post;

const PostContainer = styled.div<{ isActive: boolean }>`
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

const PostTitle = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;

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
  width: 55px;
`;
