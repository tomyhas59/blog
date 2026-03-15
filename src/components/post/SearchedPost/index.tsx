import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { baseURL } from "../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../pages/Info/MyInfo";
import useSetParams from "../../../hooks/useSetParams";

import * as S from "./SearchedPostStyles";
import * as CS from "../PostCommonStyles";
// 제목 스타일 재사용
import { PostType } from "../../../types";
import { PostTitle } from "../Items/PostItem/PostItemStyles";

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

  // 검색어 하이라이트 로직 (원본 유지)
  const highlightText = (text: string) => {
    if (!searchTextParam) return text;
    const regex = new RegExp(`(${searchTextParam})`, "gi");
    const cleanText = text.replace(/<br>/gi, " ");

    if (cleanText.includes(searchTextParam)) {
      return cleanText
        .split(regex)
        .map((part, index) =>
          part.toLowerCase() === searchTextParam.toLowerCase() ? (
            <S.HighlightedText key={index}>{part}</S.HighlightedText>
          ) : (
            part
          ),
        );
    }
    return cleanText;
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

  const totalReplies = post.Comments.reduce(
    (total, comment) => total + (comment.Replies?.length || 0),
    0,
  );

  if (!searchTextParam) return null;

  return (
    <>
      <S.SearchedPostContainer
        onClick={goToSearchedPostDetail}
        isActive={postId === post.id}
      >
        <CS.PostHeaderLeftSection>
          <S.NicknameButton>
            <img
              src={
                post.User.Image
                  ? `${baseURL}/${post.User.Image.src}`
                  : DEFAULT_PROFILE_IMAGE
              }
              alt="유저"
            />
            <S.Nickname>
              {((searchOptionParam === "author" || "all") &&
                highlightText(post.User.nickname.slice(0, 5))) ||
                post.User.nickname.slice(0, 5)}
            </S.Nickname>
          </S.NicknameButton>

          <PostTitle isViewed={viewedPosts?.includes(post.id) as boolean}>
            {highlightText(post.title)}
            <span className="comment-count">
              [{post.Comments.length + totalReplies}]
            </span>
            {post.Images.length > 0 && (
              <span className="icon-preview">
                <FontAwesomeIcon
                  icon={post.Images.length === 1 ? faImage : faImages}
                />
              </span>
            )}
          </PostTitle>
        </CS.PostHeaderLeftSection>

        <CS.PostMetaInfo>
          <CS.Date>{moment(post.createdAt).format("l")}</CS.Date>
          <CS.ViewCount>{post.viewCount}</CS.ViewCount>
        </CS.PostMetaInfo>
      </S.SearchedPostContainer>

      {searchOptionParam === "all" && (
        <S.ContentPreview>
          {/* 본문 매칭 */}
          <div>{highlightText(post.content)}</div>

          {/* 댓글/답글 매칭 */}
          {post.Comments.map((comment) => (
            <React.Fragment key={comment.id}>
              {comment.content.includes(searchTextParam) && (
                <S.MatchItem>
                  <span className="match-nickname">
                    {comment.User.nickname}
                  </span>
                  {highlightText(comment.content)}
                </S.MatchItem>
              )}
              {comment.Replies.map(
                (reply) =>
                  reply.content.includes(searchTextParam) && (
                    <S.MatchItem
                      style={{ marginLeft: "20px", fontStyle: "italic" }}
                      key={reply.id}
                    >
                      <span className="match-nickname">
                        {reply.User.nickname}
                      </span>
                      {highlightText(reply.content)}
                    </S.MatchItem>
                  ),
              )}
            </React.Fragment>
          ))}
        </S.ContentPreview>
      )}
    </>
  );
};

export default SearchedPost;
