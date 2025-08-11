import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/ui/Spinner";
import SearchedPagination from "../components/pagination/SearchedPagination";
import { useLocation } from "react-router-dom";
import { usePagination } from "../hooks/PaginationProvider";
import SearchedPost from "../components/post/SearchedPost";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import PostInfo from "../components/post/PostInfo";

const SearchPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { searchedPosts, totalSearchedPostsCount, searchedPostsLoading } =
    useSelector((state: RootState) => state.post);
  const { searchedCurrentPage, setSearchedCurrentPage } = usePagination();

  const [searchText, setSearchText] = useState<string>("");
  const [searchOption, setSearchOption] = useState<string>("");

  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewedPosts);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTextParam = params.get("searchText");
    const searchOptionParam = params.get("searchOption");
    const pageParam = params.get("page");

    if (searchTextParam) setSearchText(searchTextParam);
    if (searchOptionParam) setSearchOption(searchOptionParam);
    if (pageParam) setSearchedCurrentPage(Number(pageParam));
  }, [location.search, setSearchedCurrentPage]);

  useEffect(() => {
    if (searchText && searchOption) {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText,
        searchOption,
        page: searchedCurrentPage,
      });
      setSearchedCurrentPage(searchedCurrentPage);
    }
  }, [
    dispatch,
    searchedCurrentPage,
    searchOption,
    searchText,
    setSearchedCurrentPage,
  ]);

  return (
    <SearchPageContainer>
      {searchedPostsLoading ? (
        <Spinner />
      ) : (
        <div>
          <SearchTitle>
            <SearchResultText>{searchText}</SearchResultText> 검색 결과
          </SearchTitle>
          <PostInfo />
          {searchedPosts.length > 0 ? (
            <ResultContainer>
              {searchedPosts.map((post: PostType) => (
                <div key={post.id}>
                  <SearchedPost post={post} viewedPosts={viewedPosts} />
                </div>
              ))}
              <SearchedPagination
                totalSearchedPostsCount={Number(totalSearchedPostsCount)}
                searchText={searchText}
                searchOption={searchOption}
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

export default SearchPage;

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
