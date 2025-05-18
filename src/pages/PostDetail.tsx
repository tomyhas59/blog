import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import "moment/locale/ko";
import { RootState } from "../reducer";
import Spinner from "../components/ui/Spinner";
import { PostType } from "../types";
import Post from "../components/post/Post";
import Pagination from "../components/pagination/Pagination";
import { io, Socket } from "socket.io-client";
import { usePagination } from "../hooks/PaginationProvider";
import SortButton from "../components/ui/SortButton";
import CommonPost from "../components/post/CommonPost";

const PostDetail = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentPage, divisor, sortBy, setSortBy, setCurrentPage } =
    usePagination();

  const { postId } = useParams();

  const { posts, post, totalPosts, getCommentsDone } = useSelector(
    (state: RootState) => state.post
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    const sortByParam = params.get("sortBy");

    if (pageParam) setCurrentPage(Number(pageParam));
    if (sortByParam) setSortBy(sortByParam);
  }, [location.search, setCurrentPage, setSortBy, divisor, postId]);

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: currentPage,
      limit: divisor,
      sortBy,
    });
    setCurrentPage(currentPage);
  }, [dispatch, currentPage, setCurrentPage, divisor, sortBy, post]);

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

  const theme = useTheme();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const commentId = params.get("commentId");
    const reCommentId = params.get("reCommentId");

    const scrollToElement = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
        element.style.backgroundColor = theme.hoverMainColor;
      }
    };

    if (commentId && getCommentsDone) scrollToElement(commentId);
    if (reCommentId && getCommentsDone) scrollToElement(reCommentId);
  }, [getCommentsDone, location.search, theme.hoverMainColor]);

  const {
    searchedPostsLoading,
    removePostLoading,
    updatePostLoading,
    addCommentLoading,
    likePostLoading,
    unLikePostLoading,
    likeCommentLoading,
    unLikeCommentLoading,
    likeReCommentLoading,
    unLikeReCommentLoading,
    getCommentsLoading,
  } = useSelector((state: RootState) => state.post);

  return (
    <PostDetailContainer>
      {removePostLoading ||
      updatePostLoading ||
      searchedPostsLoading ||
      addCommentLoading ||
      likePostLoading ||
      likeCommentLoading ||
      unLikeCommentLoading ||
      likeReCommentLoading ||
      unLikeReCommentLoading ||
      getCommentsLoading ||
      unLikePostLoading ? (
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
          <Pagination totalPosts={Number(totalPosts)} />
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
