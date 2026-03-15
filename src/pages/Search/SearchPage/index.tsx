import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../reducer";
import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import { usePagination } from "../../../hooks/PaginationProvider";
import { PostType } from "../../../types";

import SearchedPost from "../../../components/post/SearchedPost";
import SearchedPagination from "../../../components/pagination/SearchedPagination";
import PostInfo from "../../../components/post/Items/PostInfo";
import SearchLayout, { ResultText } from "../SearchLayout";

const SearchPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [searchOption, setSearchOption] = useState<string>("");
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  const { searchedPosts, totalSearchedPostsCount, searchedPostsLoading } =
    useSelector((state: RootState) => state.post);
  const { searchedCurrentPage, setSearchedCurrentPage } = usePagination();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewed);
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
    }
  }, [dispatch, searchedCurrentPage, searchOption, searchText]);

  return (
    <SearchLayout
      isLoading={searchedPostsLoading}
      hasResults={searchedPosts.length > 0}
      titleContent={
        <>
          <ResultText>{searchText}</ResultText> 검색 결과
        </>
      }
    >
      <PostInfo />
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
    </SearchLayout>
  );
};

export default SearchPage;
