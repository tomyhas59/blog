import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import "moment/locale/ko";
import { RootState } from "../reducer";
import Spinner from "../components/Spinner";
import { PostType } from "../types";
import Post from "../components/Post";
import Pagination from "./Pagination";
import { io, Socket } from "socket.io-client";
import { usePagination } from "../hooks/PaginationProvider";
import SortButton from "../components/SortButton";
import CommonPost from "../components/CommonPost";

const PostDetail = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentPage, postsPerPage, sortBy, setSortBy, setCurrentPage } =
    usePagination();

  const { postId } = useParams();

  const { posts, post, totalPosts } = useSelector(
    (state: RootState) => state.post
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    const sortByParam = params.get("sortBy");
    if (pageParam) setCurrentPage(Number(pageParam));
    if (sortByParam) setSortBy(sortByParam);
  }, [location.search, setCurrentPage, setSortBy]);

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: currentPage,
      limit: postsPerPage,
      sortBy,
    });
    setCurrentPage(currentPage);
  }, [dispatch, currentPage, setCurrentPage, postsPerPage, sortBy, post]);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewedPosts);
    if (!viewedPosts.includes(post.id)) {
      const newViewedPosts = [...viewedPosts, post.id];
      localStorage.setItem("viewedPosts", JSON.stringify(newViewedPosts));
    }
  }, [post]);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  const {
    searchedPostsLoading,
    removePostLoading,
    updatePostLoading,
    addCommentLoading,
    likePostLoading,
    unLikePostLoading,
    uploadImagesLoading,
  } = useSelector((state: RootState) => state.post);

  return (
    <PostDetailContainer>
      {removePostLoading ||
      updatePostLoading ||
      searchedPostsLoading ||
      addCommentLoading ||
      likePostLoading ||
      unLikePostLoading ||
      uploadImagesLoading ? (
        <Spinner />
      ) : null}
      <CommonPost />
      <SortButton />
      {posts.length > 0 && (
        <div>
          {posts.map((post: PostType) => (
            <div key={post.id}>
              <Post
                post={post}
                viewedPosts={viewedPosts}
                postId={Number(postId)}
              />
            </div>
          ))}
          <Pagination totalPosts={Number(totalPosts)} postId={post.id} />
        </div>
      )}
    </PostDetailContainer>
  );
};

export default PostDetail;

const PostDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
