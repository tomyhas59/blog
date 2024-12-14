import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";
import { useLocation } from "react-router-dom";

const Main = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, totalPosts, getPostsLoading } = useSelector(
    (state: RootState) => state.post
  );
  const { currentPage, postsPerPage, setCurrentPage } = usePagination();
  const [page, setPage] = useState<number>(currentPage);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    if (pageParam) setPage(Number(pageParam));
  }, [location.search]);

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: page,
      limit: postsPerPage,
    });
    setCurrentPage(page);
  }, [currentPage, postsPerPage, dispatch, page, setCurrentPage]);

  return (
    <div>
      {getPostsLoading ? (
        <Spinner />
      ) : (
        posts.length > 0 && (
          <div>
            {posts.map((post: PostType) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
            <Pagination totalPosts={Number(totalPosts)} />
          </div>
        )
      )}
    </div>
  );
};

export default Main;
