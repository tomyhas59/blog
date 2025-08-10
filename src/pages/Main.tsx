import React, { useEffect, useState } from "react";
import Post from "../components/post/Post";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import Pagination from "../components/pagination/Pagination";
import { usePagination } from "../hooks/PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/ui/Spinner";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SortButton from "../components/ui/SortButton";
import PostInfo from "../components/ui/PostInfo";

const Main = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, totalPostsCount, getPostsLoading } = useSelector(
    (state: RootState) => state.post
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);
  const { currentPage, divisor, sortBy, setCurrentPage } = usePagination();

  useEffect(() => {
    const viewedPostsCookie = JSON.parse(
      localStorage.getItem("viewedPosts") || "[]"
    );
    setViewedPosts(viewedPostsCookie);
  }, []);

  useEffect(() => {
    const currentMode = localStorage.getItem("darkMode") === "enabled";
    dispatch({ type: "SET_MODE", data: currentMode });
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");

    if (pageParam) setCurrentPage(Number(pageParam));
  }, [location.search, setCurrentPage]);

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: currentPage,
      limit: divisor,
      sortBy,
    });
  }, [currentPage, divisor, dispatch, sortBy, location.pathname]);

  return (
    <MainContainer>
      <Banner>BANNER</Banner>
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
    </MainContainer>
  );
};

export default Main;

const MainContainer = styled.div`
  max-width: 800px;
  padding: 5px 10px;
  margin: 0 auto;
`;

const Banner = styled.div`
  background-color: ${(props) => props.theme.subColor};
  color: white;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;
