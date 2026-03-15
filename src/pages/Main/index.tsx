import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GET_POSTS_REQUEST } from "../../reducer/post";
import { usePagination } from "../../hooks/PaginationProvider";
import { RootState } from "../../reducer";
import { PostType } from "../../types";

// 컴포넌트들
import Post from "../../components/post/Items/PostItem";
import Pagination from "../../components/pagination/Pagination";
import Spinner from "../../components/ui/Spinner";

import PostInfo from "../../components/post/Items/PostInfo";

// 스타일
import * as S from "./styles";
import SortButton from "../../components/post/Items/SortButton";

const Main = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, totalPostsCount, getPostsLoading } = useSelector(
    (state: RootState) => state.post,
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);
  const { currentPage, divisor, sortBy, setCurrentPage } = usePagination();

  // 최근 본 게시글 쿠키 로드
  useEffect(() => {
    const viewedPostsCookie = JSON.parse(
      localStorage.getItem("viewedPosts") || "[]",
    );
    setViewedPosts(viewedPostsCookie);
  }, []);

  // 다크모드 초기 설정
  useEffect(() => {
    const currentMode = localStorage.getItem("darkMode") === "enabled";
    dispatch({ type: "SET_MODE", data: currentMode });
  }, [dispatch]);

  // URL 쿼리 파라미터에서 페이지 번호 추출
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    if (pageParam) setCurrentPage(Number(pageParam));
  }, [location.search, setCurrentPage]);

  // 게시글 데이터 요청
  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: currentPage,
      limit: divisor,
      sortBy,
    });
  }, [currentPage, divisor, dispatch, sortBy, location.pathname]);

  return (
    <S.MainContainer>
      <SortButton />
      <PostInfo />
      {getPostsLoading ? (
        <Spinner />
      ) : (
        posts.length > 0 && (
          <div>
            {posts.map((post: PostType) => (
              <Post key={post.id} post={post} viewedPosts={viewedPosts} />
            ))}
            <Pagination totalPostsCount={Number(totalPostsCount)} />
          </div>
        )
      )}
    </S.MainContainer>
  );
};

export default Main;
