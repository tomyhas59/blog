import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../reducer";
import { GET_HASHTAG_POSTS_REQUEST } from "../../../reducer/post";
import { usePagination } from "../../../hooks/PaginationProvider";
import { PostType } from "../../../types";

import Post from "../../../components/post/Items/PostItem";
import HashtagPagination from "../../../components/pagination/HashtagPagination";
import SearchLayout, { ResultText } from "../SearchLayout";

const HashtagPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [hashtagName, setHashtagName] = useState<string>("");
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  const { hashtagPosts, getHashtagPostsLoading, totalHashtagPostsCount } =
    useSelector((state: RootState) => state.post);
  const { hashtagCurrentPage, setHashtagCurrentPage } = usePagination();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewed);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nameParam = params.get("hashtagName");
    const pageParam = params.get("page");

    if (nameParam) setHashtagName(nameParam);
    if (pageParam) setHashtagCurrentPage(Number(pageParam));
  }, [location.search, setHashtagCurrentPage]);

  useEffect(() => {
    if (hashtagName) {
      dispatch({
        type: GET_HASHTAG_POSTS_REQUEST,
        hashtagName,
        page: hashtagCurrentPage,
      });
    }
  }, [dispatch, hashtagCurrentPage, hashtagName]);

  return (
    <SearchLayout
      isLoading={getHashtagPostsLoading}
      hasResults={hashtagPosts.length > 0}
      titleContent={<ResultText>#{hashtagName}</ResultText>}
    >
      {hashtagPosts.map((post: PostType) => (
        <div key={post.id}>
          <Post
            post={post}
            viewedPosts={viewedPosts}
            hashtagName={hashtagName}
          />
        </div>
      ))}
      <HashtagPagination
        totalHashtagPostsCount={Number(totalHashtagPostsCount)}
        hashtagName={hashtagName}
      />
    </SearchLayout>
  );
};

export default HashtagPage;
