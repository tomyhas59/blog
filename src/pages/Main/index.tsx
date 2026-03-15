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
import SortButton from "../../components/post/Items/SortButton";

// 스타일
import * as S from "./MainStyles";

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
      <S.MainHeader>
        <S.SortButtonWrapper>
          <SortButton />
        </S.SortButtonWrapper>
      </S.MainHeader>

      <S.PostInfoWrapper>
        <PostInfo />
      </S.PostInfoWrapper>

      <S.PostsSection>
        {getPostsLoading ? (
          <S.LoadingWrapper>
            <Spinner />
          </S.LoadingWrapper>
        ) : posts.length > 0 ? (
          <>
            <S.PostsList>
              {posts.map((post: PostType) => (
                <Post key={post.id} post={post} viewedPosts={viewedPosts} />
              ))}
            </S.PostsList>
            <S.PaginationWrapper>
              <Pagination totalPostsCount={Number(totalPostsCount)} />
            </S.PaginationWrapper>
          </>
        ) : (
          <S.EmptyState>
            <S.EmptyIcon>
              <i className="fas fa-inbox"></i>
            </S.EmptyIcon>
            <S.EmptyTitle>게시글이 없습니다</S.EmptyTitle>
            <S.EmptyDescription>
              첫 번째 게시글을 작성해보세요!
            </S.EmptyDescription>
          </S.EmptyState>
        )}
      </S.PostsSection>
    </S.MainContainer>
  );
};

export default Main;
