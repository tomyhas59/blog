import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import "moment/locale/ko";
import { RootState } from "../reducer";
import Spinner from "../components/Spinner";
import { PostType } from "../types";
import { usePagination } from "../hooks/PaginationProvider";
import SearchedPagination from "./SearchedPagination";
import SeachedPost from "../components/SeachedPost";
import CommonPost from "../components/CommonPost";

const SearchedPostDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { searchedCurrentPage, setSearchedCurrentPage } = usePagination();
  const [searchText, setSearchText] = useState<string>("");
  const [searchOption, setSearchOption] = useState<string>("");
  const { postId } = useParams();

  const { searchedPosts, post, totalSearchedPosts } = useSelector(
    (state: RootState) => state.post
  );

  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    setViewedPosts(viewedPosts);
    if (!viewedPosts.includes(post.id)) {
      const newViewedPosts = [...viewedPosts, post.id];
      localStorage.setItem("viewedPosts", JSON.stringify(newViewedPosts));
    }
  }, [post]);

  useEffect(() => {
    if (searchText && searchOption) {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText,
        searchOption,
        searchedCurrentPage,
      });
    }
  }, [dispatch, searchText, searchOption, searchedCurrentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTextParam = params.get("searchText");
    const searchOptionParam = params.get("searchOption");
    const pageParam = params.get("page");

    if (searchTextParam) setSearchText(searchTextParam);
    if (searchOptionParam) setSearchOption(searchOptionParam);
    if (pageParam) setSearchedCurrentPage(Number(pageParam));
  }, [location.search, setSearchedCurrentPage]);

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
        element.style.backgroundColor = "#fffae6";
      }
    };

    setTimeout(() => {
      if (commentId) scrollToElement(commentId);
      if (reCommentId) scrollToElement(reCommentId);
    }, 200);
  }, [location.search]);

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
  } = useSelector((state: RootState) => state.post);

  return (
    <>
      {removePostLoading ||
      updatePostLoading ||
      searchedPostsLoading ||
      addCommentLoading ||
      likePostLoading ||
      likeCommentLoading ||
      unLikeCommentLoading ||
      likeReCommentLoading ||
      unLikeReCommentLoading ||
      unLikePostLoading ? (
        <Spinner />
      ) : null}
      <CommonPost />
      {searchedPosts.length > 0 && (
        <div>
          {searchedPosts.map((post: PostType) => (
            <div key={post.id}>
              <SeachedPost
                post={post}
                viewedPosts={viewedPosts}
                postId={Number(postId)}
              />
            </div>
          ))}
          <SearchedPagination
            totalSearchedPosts={Number(totalSearchedPosts)}
            searchText={searchText}
            searchOption={searchOption}
          />
        </div>
      )}
    </>
  );
};

export default SearchedPostDetail;
