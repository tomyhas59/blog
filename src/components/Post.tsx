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
import moment from "moment";
import FollowButton from "./FollowButton";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";

const Post = ({ post }: { post: PostType }) => {
  const navigator = useNavigate();
  const me = useSelector((state: RootState) => state.user.me);
  const id = me?.id;
  const goToPostDetail = (postId: number) => {
    navigator(`/post/${postId}`);
  };
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

  const onSearch = useCallback(() => {
    dispatch({
      type: SEARCH_POSTS_REQUEST,
      query: post.User.nickname,
      searchOption: "author",
    });
    navigator("/search");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [dispatch, navigator, post.User.nickname]);

  return (
    <PostContainer onClick={() => goToPostDetail(post.id)}>
      <PostHeaderFlex>
        <PostNicknameAndDate>
          <NicknameButton onClick={toggleShowInfo}>
            <img
              src={
                post.User.Image
                  ? `${baseURL}/${post.User.Image.src}`
                  : `${DEFAULT_PROFILE_IMAGE}`
              }
              alt="유저 이미지"
            />
            {post.User.nickname.slice(0, 5)}
          </NicknameButton>
          {showInfo && (
            <InfoMenu ref={infoMenuRef}>
              <Button onClick={onSearch}>작성 글 보기</Button>
              {id !== post.User.id && (
                <FollowButton userId={post.User.id} setShowInfo={setShowInfo} />
              )}
            </InfoMenu>
          )}
          <Date>{moment(post.createdAt).format("l")}</Date>
        </PostNicknameAndDate>
        <PostTitle>{post.title}</PostTitle>
        <LikeContainer>
          <Liked>좋아요 {post.Likers?.length}개</Liked>
        </LikeContainer>
      </PostHeaderFlex>
    </PostContainer>
  );
};

export default Post;

const PostContainer = styled.div`
  max-width: 800px;
  padding: 15px;
  margin: 0 auto;
  border: 1px solid #f4f4f4;
  cursor: pointer;
  &:hover {
    background-color: #f4f4f4;
  }
`;

const PostHeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  @media (max-width: 480px) {
    display: grid;
    grid-template-areas:
      "a b"
      "c c";
  }
`;

const PostTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 8px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
  @media (max-width: 480px) {
    grid-area: c;
  }
`;

const PostNicknameAndDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NicknameButton = styled.button`
  display: flex;
  justify-content: space-around;
  border-radius: 30%;
  align-items: center;
  min-width: 70px;
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

const Liked = styled.span`
  width: 50px;
  margin: 2px;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const LikeContainer = styled.div`
  position: relative;
  @media (max-width: 480px) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
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

const Date = styled.span`
  width: 100px;
  margin: 5px;
  color: silver;
`;
