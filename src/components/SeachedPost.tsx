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
  PostHeaderFlex,
  PostTitle,
  NicknameButton,
  Nickname,
  PostInfo,
  Date,
  Liked,
  ViewCount,
} from "./Post";
import { usePagination } from "../hooks/PaginationProvider";
const SeachedPost = ({
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
  const searchOptiontParam = params.get("searchOption");
  const pageParam = params.get("page");
  const { setCurrentCommentsPage } = usePagination();

  const highlightText = (text: string) => {
    if (!searchTextParam) return text;
    const regex = new RegExp(`(${searchTextParam})`, "gi");
    text = text.replace(/<br>/gi, " ");
    console.log(text);
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
    searchOption: searchOptiontParam || "",
    page: Number(pageParam),
    postId: post.id,
  });

  const goToSearchedPostDetail = useCallback(() => {
    setParams({ searchText: searchTextParam || "" });
    setCurrentCommentsPage(1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [searchTextParam, setParams, setCurrentCommentsPage]);

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
              <Nickname>
                {((searchOptiontParam === "author" || "all") &&
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
          </PostHeaderFlex>
          <PostInfo>
            <Date>{moment(post.createdAt).format("l")}</Date>
            <Liked>{post.Likers.length === 0 ? "" : post.Likers.length}</Liked>
            <ViewCount>{post.viewCount}</ViewCount>
          </PostInfo>
        </PostContainer>

        <Content>
          {searchOptiontParam === "all" && (
            <div>{highlightText(post.content)}</div>
          )}
          {searchOptiontParam === "all" &&
            post.Comments.map((comment) => (
              <Comment key={comment.id}>
                {comment.content.includes(searchTextParam) && (
                  <div>
                    <Nickname>{comment.User.nickname} : </Nickname>
                    {highlightText(comment.content)}
                  </div>
                )}
                {comment.ReComments.map((recomment) => (
                  <ReComment key={recomment.id}>
                    {recomment.content.includes(searchTextParam) && (
                      <div>
                        <Nickname>{recomment.User.nickname} : </Nickname>
                        {highlightText(recomment.content)}
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

export default SeachedPost;

const SearchedPostContainer = styled.div<{ isActive: boolean }>`
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
  background-color: yellow;
  font-weight: bold;
`;
