import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Main = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, totalPosts, getPostsLoading } = useSelector(
    (state: RootState) => state.post
  );
  const { currentPage, postsPerPage, paginate } = usePagination();
  const [page, setPage] = useState<number>(currentPage);
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    if (pageParam) setPage(Number(pageParam));
  }, [location.search]);

  useEffect(() => {
    dispatch({
      type: GET_POSTS_REQUEST,
      page: page,
      limit: postsPerPage,
      sortBy,
    });
    paginate(page);
  }, [currentPage, postsPerPage, dispatch, page, sortBy, paginate]);

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setPage(1);

    const params = new URLSearchParams(location.search);
    params.set("page", "1");
    params.set("sortBy", newSortBy);
    navigator({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <MainContainer>
      <Banner>BANNER</Banner>
      <SortButtons>
        <label>
          <input
            type="radio"
            name="sort"
            value="recent"
            checked={sortBy === "recent"}
            onChange={handleSortChange}
          />
          최신순
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="popular"
            checked={sortBy === "popular"}
            onChange={handleSortChange}
          />
          인기순
        </label>
      </SortButtons>
      {getPostsLoading ? (
        <Spinner />
      ) : (
        posts.length > 0 && (
          <div>
            {posts.map((post: PostType) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
            <Pagination totalPosts={Number(totalPosts)} />
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
  background-color: #4caf50;
  color: white;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const SortButtons = styled.div`
  display: flex;
  justify-content: right;
  gap: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    &:hover {
      background-color: #f1f1f1;
      border-radius: 5px;
    }
    input {
      margin-right: 4px;
    }
  }
`;
