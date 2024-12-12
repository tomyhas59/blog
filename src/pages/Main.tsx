import React, { useEffect } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

const Main = () => {
  const dispatch = useDispatch();

  const { posts, totalPosts, getPostsLoading } = useSelector(
    (state: RootState) => state.post
  );
  const { currentPage, postsPerPage } = usePagination();

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      data: {
        page: currentPage,
        limit: postsPerPage,
      },
    });
  }, [currentPage, postsPerPage, dispatch]);

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
