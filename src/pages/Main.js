import React, { useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import { ALL_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";

const Main = () => {
  const dispatch = useDispatch();
  const { allPosts, allPostsLoading } = useSelector((state) => state.post);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3); // 페이지당 표시할 게시물 수

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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <PostForm />
      <br />
      {allPostsLoading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          {currentPosts.map((post) => (
            <div key={post.id}>
              <Post post={post} />
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
