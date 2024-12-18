import React, { useCallback } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import { PostType } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../config";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import useSetParams from "../hooks/useSetParams";

const SeachedPost = ({ post, postId }: { post: PostType; postId?: number }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptiontParam = params.get("searchOption");
  const pageParam = params.get("page");

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
    searchText: searchTextParam || "",
    searchOption: searchOptiontParam || "",
    page: Number(pageParam),
    postId: post.id,
  });

  const goToSearchedPostDetail = useCallback(() => {
    setParams({ searchText: searchTextParam || "" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [setParams]);

  const totalReComments = post.Comments.reduce(
    (total, comment) => total + comment.ReComments.length,
    0
  );

  if (!searchTextParam) {
    return null;
  }

  if (searchTextParam) {
    return (
      <div>
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
              <Nickname>
                {((searchOptiontParam === "author" || "all") &&
                  highlightText(post.User.nickname.slice(0, 5))) ||
                  post.User.nickname.slice(0, 5)}
              </Nickname>
            </NicknameButton>
            <PostTitle>
              {highlightText(post.title) || post.title}
              <span style={{ fontSize: "12px" }}>
                [{post.Comments.length + totalReComments}]
              </span>
            </PostTitle>
          </PostHeaderFlex>
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
        </PostContainer>
      </div>
    );
  } else {
    return null;
  }
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
  color: ${(props) => props.theme.mainColor};
  font-weight: bold;
  width: 55px;
`;

const Content = styled.div`
  margin-top: 15px;
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
