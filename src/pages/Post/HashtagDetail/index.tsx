import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { GET_HASHTAG_POSTS_REQUEST } from "../../../reducer/post";
import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { usePagination } from "../../../hooks/PaginationProvider";

import Post from "../../../components/post/Items/PostItem";
import HashtagPagination from "../../../components/pagination/HashtagPagination";
import PostDetailLayout from "../PostDetailLayout";

const HashtagPostDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { postId } = useParams();
  const { hashtagCurrentPage, setHashtagCurrentPage, setCurrentCommentsPage } =
    usePagination();

  const [hashtagName, setHashtagName] = useState<string>("");
  const { hashtagPosts, post, totalHashtagPostsCount } = useSelector(
    (state: RootState) => state.post,
  );
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  // 파라미터 핸들링
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashtagNameParam = params.get("hashtagName");
    const pageParam = params.get("page");
    const commentsPageParam = params.get("cPage");

    if (hashtagNameParam) setHashtagName(hashtagNameParam);
    if (pageParam) setHashtagCurrentPage(Number(pageParam));
    if (commentsPageParam) setCurrentCommentsPage(Number(commentsPageParam));
  }, [location.search, setHashtagCurrentPage, setCurrentCommentsPage]);

  // 데이터 요청
  useEffect(() => {
    if (hashtagName) {
      dispatch({
        type: GET_HASHTAG_POSTS_REQUEST,
        hashtagName,
        page: hashtagCurrentPage,
      });
    }
  }, [dispatch, hashtagCurrentPage, hashtagName]);

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
      {hashtagPosts.length > 0 && (
        <div>
          {hashtagPosts.map((p: PostType) => (
            <Post
              key={p.id}
              post={p}
              viewedPosts={viewedPosts}
              postId={Number(postId)}
              hashtagName={hashtagName}
            />
          ))}
          <HashtagPagination
            totalHashtagPostsCount={Number(totalHashtagPostsCount)}
            hashtagName={hashtagName}
          />
        </div>
      )}
    </PostDetailLayout>
  );
};

export default HashtagPostDetail;
