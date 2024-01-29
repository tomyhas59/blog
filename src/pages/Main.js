import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import { ALL_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { usePagination } from "./PaginationProvider";

const Main = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const {
    allPosts,
    searchPosts,
    searchNicknameError,
    imagePaths,
    addPostDone,
  } = useSelector((state) => state.post);
  const { currentPage, postsPerPage, paginate } = usePagination();

  useEffect(() => {
    if (searchNicknameError) {
      alert(searchNicknameError);
    }
  }, [searchNicknameError]);

  useEffect(() => {
    if (addPostDone) {
      dispatch({
        type: "GO_HOME",
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
      {searchPosts.length > 0 ? (
        <div>
          {searchPosts.map((post) => (
            <div key={post.id}>
              <Post post={post} imagePaths={imagePaths} />
              <Divider />
            </div>
          ))}
        </div>
      ) : (
        <>
          {currentPosts.map((post) => (
            <div key={post.id}>
              <Post post={post} imagePaths={imagePaths} />
              <Divider />
            </div>
          ))}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={allPosts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default Main;
