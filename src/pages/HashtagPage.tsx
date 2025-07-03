import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { RootState } from "../reducer";
import styled from "styled-components";
import Spinner from "../components/ui/Spinner";
import { PostType } from "../types";
import Post from "../components/post/Post";
import HashtagPagination from "../components/pagination/HashtagPagination";
import { GET_HASHTAG_POSTS_REQUEST } from "../reducer/post";
import { usePagination } from "../hooks/PaginationProvider";

const HashtagPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [hashtagName, setHashtagName] = useState<string>("");

  const { hashtagPosts, getHashtagPostsLoading, totalHashtagPosts } =
    useSelector((state: RootState) => state.post);

  const { hashtagCurrentPage, setHashtagCurrentPage } = usePagination();

  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewedPosts);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashtagNameParam = params.get("hashtagName");
    const pageParam = params.get("page");

    if (hashtagNameParam) setHashtagName(hashtagNameParam);
    if (pageParam) setHashtagCurrentPage(Number(pageParam));
  }, [location.search, setHashtagCurrentPage]);

  useEffect(() => {
    if (hashtagName) {
      dispatch({
        type: GET_HASHTAG_POSTS_REQUEST,
        hashtagName,
        page: hashtagCurrentPage,
      });
      setHashtagCurrentPage(hashtagCurrentPage);
    }
  }, [dispatch, hashtagCurrentPage, hashtagName, setHashtagCurrentPage]);

  return (
    <SearchPageContainer>
      {getHashtagPostsLoading ? (
        <Spinner />
      ) : (
        <div>
          <SearchTitle>
            <SearchResultText>#{hashtagName}</SearchResultText>
          </SearchTitle>
          {hashtagPosts.length > 0 ? (
            <ResultContainer>
              {hashtagPosts.map((post: PostType) => (
                <div key={post.id}>
                  <Post
                    post={post}
                    viewedPosts={viewedPosts}
                    hashtagName={hashtagName}
                  />
                </div>
              ))}
              <HashtagPagination
                totalHashtagPosts={Number(totalHashtagPosts)}
                hashtagName={hashtagName}
              />
            </ResultContainer>
          ) : (
            <NoResults>검색 결과가 없습니다.</NoResults>
          )}
        </div>
      )}
    </SearchPageContainer>
  );
};

export default HashtagPage;

const SearchPageContainer = styled.div`
  max-width: 800px;
  padding: 5px 10px;
  margin: 0 auto;
`;

const SearchTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResults = styled.div`
  font-size: 18px;
  color: #555;
`;

const SearchResultText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 10px;
  color: red;
`;
