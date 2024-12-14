import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

import SearchedPagination from "./SearchedPagination";
import { useLocation } from "react-router-dom";
import { usePagination } from "./PaginationProvider";
import SeachedPost from "../components/SeachedPost";

const SearchPage = () => {
  const location = useLocation();

  const { searchedPosts, totalSearchedPosts, searchedPostsLoading } =
    useSelector((state: RootState) => state.post);
  const { searchedCurrentPage } = usePagination();

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
