import React, { useCallback } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../types";
import { useLocation } from "react-router-dom";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import useSetParams from "../hooks/useSetParams";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import {
  PostHeaderLeftSection,
  PostTitle,
  NicknameButton,
  Nickname,
  PostMetaInfo,
  Date,
  Liked,
  ViewCount,
} from "./Post";

const SearchedPost = ({
  post,
  postId,
  viewedPosts,
}: {
  post: PostType;
  viewedPosts?: number[];
  postId?: number;
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptionParam = params.get("searchOption");
  const pageParam = params.get("page");

  const highlightText = (text: string) => {
    if (!searchTextParam) return text;
    const regex = new RegExp(`(${searchTextParam})`, "gi");
    text = text.replace(/<br>/gi, " ");
    if (text.includes(searchTextParam)) {
      return text
        .split(regex)
        .map((part, index) =>
          part.toLowerCase() === searchTextParam.toLowerCase() ? (
            <HighlightedText key={index}>{part}</HighlightedText>
          ) : (
            part
          )
        );
    }
  };
  const setParams = useSetParams({
    searchOption: searchOptionParam || "",
    page: Number(pageParam),
    postId: post.id,
  });

  const goToSearchedPostDetail = useCallback(() => {
    setParams({ searchText: searchTextParam || "" });

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [searchTextParam, setParams]);

  const totalReComments = post.Comments.reduce(
    (total, comment) => total + comment.ReComments.length,
    0
  );

  if (!searchTextParam) {
    return null;
  }

  if (searchTextParam) {
    return (
      <SearchedPostContainer
        onClick={goToSearchedPostDetail}
        isActive={postId === post.id}
      >
        <PostContainer>
          <PostHeaderLeftSection>
            <NicknameButton>
              <img
                src={
                  post.User.Image
                    ? `${baseURL}/${post.User.Image.src}`
                    : `${DEFAULT_PROFILE_IMAGE}`
                }
                alt="유저 이미지"
              />
              <Nickname>
                {((searchOptionParam === "author" || "all") &&
                  highlightText(post.User.nickname.slice(0, 5))) ||
                  post.User.nickname.slice(0, 5)}
              </Nickname>
            </NicknameButton>
            <PostTitle isViewed={viewedPosts?.includes(post.id) as boolean}>
              {highlightText(post.title) || post.title}
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
          </PostHeaderLeftSection>
          <PostMetaInfo>
            <Date>{moment(post.createdAt).format("l")}</Date>
            <Liked>{post.Likers.length === 0 ? "" : post.Likers.length}</Liked>
            <ViewCount>{post.viewCount}</ViewCount>
          </PostMetaInfo>
        </PostContainer>

        <Content>
          {searchOptionParam === "all" && (
            <div>{highlightText(post.content)}</div>
          )}
          {searchOptionParam === "all" &&
            post.Comments.map((comment) => (
              <Comment key={comment.id}>
                {comment.content.includes(searchTextParam) && (
                  <div>
                    <Nickname>{comment.User.nickname} : </Nickname>
                    {highlightText(comment.content)}
                  </div>
                )}
                {comment.ReComments.map((reComment) => (
                  <ReComment key={reComment.id}>
                    {reComment.content.includes(searchTextParam) && (
                      <div>
                        <Nickname>{reComment.User.nickname} : </Nickname>
                        {highlightText(reComment.content)}
                      </div>
                    )}
                  </ReComment>
                ))}
              </Comment>
            ))}
        </Content>
      </SearchedPostContainer>
    );
  } else {
    return null;
  }
};

export default SearchedPost;

const SearchedPostContainer = styled.div<{ isActive: boolean }>`
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
`;

const PostContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  padding: 5px 10px;
  margin: 0 auto;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: start;
  }
`;

const Content = styled.div`
  margin: 15px;
  color: #555;
  font-size: 14px;
  padding-left: 20px;
  border-left: 2px solid #ddd;
`;

const Comment = styled.div``;

const ReComment = styled.div`
  margin-top: 5px;
  padding-left: 20px;
  font-style: italic;
  color: #777;
`;

const HighlightedText = styled.span`
  background-color: ${(props) => props.theme.hoverMainColor};
  font-weight: bold;
`;
