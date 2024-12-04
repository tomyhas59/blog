import React, { useEffect } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { ALL_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

const Main = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const { allPosts, addPostDone, allPostsLoading } = useSelector(
    (state: RootState) => state.post
  );
  const { currentPage, postsPerPage, paginate } = usePagination();

  useEffect(() => {
    if (addPostDone) {
      dispatch({
        type: "REFRESH",
      });
      paginate(1);
      navigator("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [addPostDone, dispatch, paginate, navigator]);

  useEffect(() => {
    //초기 게시물 불러오기
    if (allPosts.length === 0) {
      dispatch({
        type: ALL_POSTS_REQUEST,
      });
    }
  }, [allPosts.length, dispatch]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      {allPostsLoading ? (
        <Spinner />
      ) : (
        allPosts.length > 0 && (
          <div>
            {currentPosts.map((post: PostType) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
            <Pagination totalPosts={allPosts.length} />
          </div>
        )
      )}
    </div>
  );
};

export default Main;
