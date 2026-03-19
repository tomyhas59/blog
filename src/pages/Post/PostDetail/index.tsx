import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useTheme } from "styled-components";

import { GET_POSTS_REQUEST } from "../../../reducer/post";
import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { usePagination } from "../../../hooks/PaginationProvider";

import Post from "../../../components/post/Items/PostItem";
import Pagination from "../../../components/pagination/Pagination";

import PostInfo from "../../../components/post/Items/PostInfo";
import PostDetailLayout from "../PostDetailLayout";
import SortButton from "../../../components/post/Items/SortButton";

const PostDetail = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const { postId } = useParams();

  const { currentPage, divisor, sortBy, setSortBy, setCurrentPage } =
    usePagination();
  const { posts, post, totalPostsCount, getCommentsDone } = useSelector(
    (state: RootState) => state.post,
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  // 페이지 및 정렬 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    const sortByParam = params.get("sortBy");

    if (pageParam) setCurrentPage(Number(pageParam));
    if (sortByParam) setSortBy(sortByParam);
  }, [location.search, setCurrentPage, setSortBy, postId]);

  // 데이터 요청
  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: currentPage,
      limit: divisor,
      sortBy,
    });
  }, [dispatch, currentPage, divisor, sortBy, post]);

  // 조회수 로직
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewed);
    if (post.id && !viewed.includes(post.id)) {
      const newViewedPosts = [...viewed, post.id];
      localStorage.setItem("viewedPosts", JSON.stringify(newViewedPosts));
    }
  }, [post]);

  // 소켓 연결
  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  // 댓글/답글 스크롤 이동 (쿼리가 있을 때만)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const commentId = params.get("commentId");
    const replyId = params.get("replyId");

    // commentId나 replyId가 있을 때만 스크롤
    if ((commentId || replyId) && getCommentsDone) {
      const scrollToElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "auto", block: "center" });
          element.style.backgroundColor = theme.hoverMainColor;
        }
      };

      if (commentId) scrollToElement(commentId);
      else if (replyId) scrollToElement(replyId);
    } else {
      // 쿼리가 없으면 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [getCommentsDone, location.search, theme.hoverMainColor]);

  return (
    <PostDetailLayout>
      <SortButton />
      <PostInfo />
      {posts.length > 0 && (
        <div>
          {posts.map((p: PostType) => (
            <Post
              key={p.id}
              post={p}
              viewedPosts={viewedPosts}
              postId={Number(postId)}
            />
          ))}
          <Pagination totalPostsCount={Number(totalPostsCount)} />
        </div>
      )}
    </PostDetailLayout>
  );
};

export default PostDetail;
