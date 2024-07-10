import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
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

  const {
    allPosts,
    searchPosts,
    searchNicknameError,
    imagePaths,
    addPostDone,
    allPostsLoading,
  } = useSelector((state: RootState) => state.post);
  const { currentPage, postsPerPage, paginate } = usePagination();

  useEffect(() => {
    if (searchNicknameError) {
      alert(searchNicknameError);
    }
  }, [searchNicknameError]);

  useEffect(() => {
    if (addPostDone) {
      dispatch({
        type: "REFRESH",
      });
      paginate(1);
      navigator("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  useEffect(() => {
    if (allPosts.length === 0) {
      // 초기 게시물 불러오기
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
      <PostForm />
      {allPostsLoading ? (
        <Spinner />
      ) : searchPosts.length > 0 ? (
        <div>
          {searchPosts.map((post: PostType) => (
            <div key={post.id}>
              <Post post={post} imagePaths={imagePaths} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {currentPosts.map((post: PostType) => (
            <div key={post.id}>
              <Post post={post} imagePaths={imagePaths} />
            </div>
          ))}
          <Pagination totalPosts={allPosts.length} />
        </>
      )}
    </div>
  );
};

export default Main;
