import React, { useCallback } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../types";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";

const SeachedPost = ({ post, postId }: { post: PostType; postId?: number }) => {
  const navigator = useNavigate();

  const setParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("searchText", post.User.nickname);
    params.set("searchOption", "author");
    params.set("page", "1");
    navigator({
      pathname: `/searchedPost/${post.id}`,
      search: params.toString(),
    });
  }, [navigator, post.User.nickname, post.id]);

  const goToSearchedPostDetail = useCallback(() => {
    setParams();
  }, [setParams]);

  const totalReComments = post.Comments.reduce(
    (total, comment) => total + comment.ReComments.length,
    0
  );

  return (
    <PostContainer
      onClick={goToSearchedPostDetail}
      isActive={postId === post.id}
    >
      <PostHeaderFlex>
        <NicknameButton>
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

export default SeachedPost;

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

const Nickname = styled.span`
  width: 55px;
`;
