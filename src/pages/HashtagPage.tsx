import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { RootState } from "../reducer";
import styled from "styled-components";
import Spinner from "../components/ui/Spinner";
import { PostType } from "../types";
import Post from "../components/post/Post";
import HashtagPagination from "../components/pagination/HashtagPagination";

const HashtagPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hashtagName = searchParams.get("hashtagName") || "";

  const { hashtagPosts, getHashtagPostsLoading, totalHashtagPosts } =
    useSelector((state: RootState) => state.post);

  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewedPosts);
  }, []);

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
                  <Post post={post} viewedPosts={viewedPosts} />
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
