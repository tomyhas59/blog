import React, { useEffect } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { usePagination } from "./PaginationProvider";
import SearchedPagination from "./SearchedPagination";

const SearchPage = () => {
  const dispatch = useDispatch();

  const { searchedPosts, totalSearchedPosts, searchedPostsLoading } =
    useSelector((state: RootState) => state.post);
  const { searchedPostsPerPage, searchedCurrentPage } = usePagination();

  const post = searchedPosts.find((post) => post);

  useEffect(() => {
    if (searchedCurrentPage > 1) {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        query: post?.User.nickname,
        searchOption: "author",
        page: searchedCurrentPage,
        limit: searchedPostsPerPage,
      });
    }
  }, [searchedCurrentPage]);

  console.log(searchedPosts);
  return (
    <div>
      {searchedPostsLoading ? (
        <Spinner />
      ) : (
        searchedPosts.length > 0 && (
          <div>
            {searchedPosts.map((post: PostType) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
            <SearchedPagination
              totalSearchedPosts={Number(totalSearchedPosts)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
