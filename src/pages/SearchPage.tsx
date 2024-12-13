import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

import SearchedPagination from "./SearchedPagination";
import { useLocation } from "react-router-dom";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { usePagination } from "./PaginationProvider";
import SeachedPost from "../components/SeachedPost";

const SearchPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { searchedPosts, totalSearchedPosts, searchedPostsLoading } =
    useSelector((state: RootState) => state.post);
  const { searchedCurrentPage, searchedPostsPerPage, setSearchedCurrentPage } =
    usePagination();

  const [searchText, setSearchText] = useState<string>("");
  const [searchOption, setSearchOption] = useState<string>("");
  const [page, setPage] = useState<number>(searchedCurrentPage);

  //페이지 이동 시 데이터 반환
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTextParam = params.get("searchText");
    const searchOptionParam = params.get("searchOption");
    const pageParam = params.get("page");

    if (searchTextParam) setSearchText(searchTextParam);
    if (searchOptionParam) setSearchOption(searchOptionParam);
    if (pageParam) setPage(Number(pageParam));
  }, [location.search]);

  useEffect(() => {
    if (searchedPosts.length < 1) {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText,
        searchOption,
        page: page,
        limit: searchedPostsPerPage,
      });
      setSearchedCurrentPage(page);
    }
  }, [searchedPosts, searchText, searchOption, page]);

  return (
    <div>
      {searchedPostsLoading ? (
        <Spinner />
      ) : (
        searchedPosts.length > 0 && (
          <div>
            {searchedPosts.map((post: PostType) => (
              <div key={post.id}>
                <SeachedPost post={post} />
              </div>
            ))}
            <SearchedPagination
              totalSearchedPosts={Number(totalSearchedPosts)}
              searchText={searchText}
              searchOption={searchOption}
            />
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
