import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { usePagination } from "../../../hooks/PaginationProvider";

import PostInfo from "../../../components/post/Items/PostInfo";
import SearchedPost from "../../../components/post/SearchedPost";
import SearchedPagination from "../../../components/pagination/SearchedPagination";
import PostDetailLayout from "../PostDetailLayout";

const SearchedPostDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { postId } = useParams();
  const {
    searchedCurrentPage,
    setSearchedCurrentPage,
    setCurrentCommentsPage,
  } = usePagination();

  const [searchText, setSearchText] = useState<string>("");
  const [searchOption, setSearchOption] = useState<string>("");
  const { searchedPosts, post, totalSearchedPostsCount } = useSelector(
    (state: RootState) => state.post,
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  // 파라미터 핸들링
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTextParam = params.get("searchText");
    const searchOptionParam = params.get("searchOption");
    const pageParam = params.get("page");
    const commentsPageParam = params.get("cPage");

    if (searchTextParam) setSearchText(searchTextParam);
    if (searchOptionParam) setSearchOption(searchOptionParam);
    if (pageParam) setSearchedCurrentPage(Number(pageParam));
    if (commentsPageParam) setCurrentCommentsPage(Number(commentsPageParam));
  }, [location.search, setSearchedCurrentPage, setCurrentCommentsPage]);

  // 데이터 요청
  useEffect(() => {
    if (searchText && searchOption) {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText,
        searchOption,
        page: searchedCurrentPage,
      });
    }
  }, [dispatch, searchText, searchOption, searchedCurrentPage]);

  // 조회수 로직
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewed);
    if (post.id && !viewed.includes(post.id)) {
      const newViewedPosts = [...viewed, post.id];
      localStorage.setItem("viewedPosts", JSON.stringify(newViewedPosts));
    }
  }, [post]);

  return (
    <PostDetailLayout>
      <PostInfo />
      {searchedPosts.length > 0 && (
        <div>
          {searchedPosts.map((p: PostType) => (
            <SearchedPost
              key={p.id}
              post={p}
              viewedPosts={viewedPosts}
              postId={Number(postId)}
            />
          ))}
          <SearchedPagination
            totalSearchedPostsCount={Number(totalSearchedPostsCount)}
            searchText={searchText}
            searchOption={searchOption}
          />
        </div>
      )}
    </PostDetailLayout>
  );
};

export default SearchedPostDetail;
