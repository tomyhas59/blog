import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_HASHTAG_POSTS_REQUEST } from "../reducer/post";
import "moment/locale/ko";
import { RootState } from "../reducer";
import Spinner from "../components/ui/Spinner";
import { PostType } from "../types";
import { usePagination } from "../hooks/PaginationProvider";
import CommonPost from "../components/post/CommonPost";
import styled from "styled-components";
import HashtagPagination from "../components/pagination/HashtagPagination";
import Post from "../components/post/Post";

const HashtagPostDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { hashtagCurrentPage, setHashtagCurrentPage, setCurrentCommentsPage } =
    usePagination();
  const [hashtagName, setHashtagName] = useState<string>("");
  const { postId } = useParams();

  const { hashtagPosts, post, totalHashtagPostsCount } = useSelector(
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
    const params = new URLSearchParams(location.search);
    const hashtagNameParam = params.get("hashtagName");
    const pageParam = params.get("page");
    const commentsPageParam = params.get("cPage");

    if (hashtagNameParam) setHashtagName(hashtagNameParam);
    if (pageParam) setHashtagCurrentPage(Number(pageParam));
    if (commentsPageParam) setCurrentCommentsPage(Number(commentsPageParam));
  }, [location.search, setHashtagCurrentPage, setCurrentCommentsPage]);

  useEffect(() => {
    if (hashtagName) {
      dispatch({
        type: GET_HASHTAG_POSTS_REQUEST,
        hashtagName,
        page: hashtagCurrentPage,
      });
    }
  }, [dispatch, hashtagCurrentPage, hashtagName, setHashtagCurrentPage]);

  const {
    getHashtagPostsLoading,
    removePostLoading,
    updatePostLoading,
    addCommentLoading,
    likePostLoading,
    unLikePostLoading,
    likeCommentLoading,
    unLikeCommentLoading,
    likeReplyLoading,
    unLikeReplyLoading,
  } = useSelector((state: RootState) => state.post);

  return (
    <SearchedPostDetailContainer>
      {removePostLoading ||
      updatePostLoading ||
      getHashtagPostsLoading ||
      addCommentLoading ||
      likePostLoading ||
      likeCommentLoading ||
      unLikeCommentLoading ||
      likeReplyLoading ||
      unLikeReplyLoading ||
      unLikePostLoading ? (
        <Spinner />
      ) : null}
      <CommonPost />
      {hashtagPosts.length > 0 && (
        <div>
          {hashtagPosts.map((post: PostType) => (
            <div key={post.id}>
              <Post
                post={post}
                viewedPosts={viewedPosts}
                postId={Number(postId)}
                hashtagName={hashtagName}
              />
            </div>
          ))}
          <HashtagPagination
            totalHashtagPostsCount={Number(totalHashtagPostsCount)}
            hashtagName={hashtagName}
          />
        </div>
      )}
    </SearchedPostDetailContainer>
  );
};

export default HashtagPostDetail;

const SearchedPostDetailContainer = styled.div`
  margin: 0 auto;
`;
