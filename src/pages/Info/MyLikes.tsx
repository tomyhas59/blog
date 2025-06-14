import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { PostType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import MyPostListRenderer from "../../components/renderer/MyPostListRenderer";
import { usePagination } from "../../hooks/PaginationProvider";
import { Heading, MoreButton } from "./MyPosts";

const MyLikes: React.FC = () => {
  const [posts, setLikedPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "title";
  const { postNum } = useSelector((state: RootState) => state.post);
  const [postId, setPostId] = useState<number | null>(null);
  const { divisor, setCurrentPage } = usePagination();

  useEffect(() => {
    const getUserLikes = async () => {
      if (me?.id) {
        try {
          const response = await axios.get(`/post/likers?userId=${me.id}`);

          setLikedPosts(response.data.likedPosts);
          setHasMore(response.data.hasMore);
          setPage(2);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserLikes();
  }, [me]);

  // 다음 페이지 게시글 불러오기
  const fetchMoreLikePosts = async () => {
    if (!me || !hasMore) return;

    try {
      const response = await axios.get(
        `/post/likers?userId=${me.id}&page=${page}&limit=5`
      );
      const newLikePosts = response.data.likedPosts;

      setLikedPosts((prev) => [...prev, ...newLikePosts]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  //불러온 게시글 클릭 시 페이지 이동
  useEffect(() => {
    if (postNum && postId !== null) {
      const searchedPostPage = Math.floor(Number(postNum) / divisor) + 1;
      setCurrentPage(searchedPostPage);
      navigator(`/post/${postId}`);
      window.scrollTo({ top: 0, behavior: "auto" });

      dispatch({ type: "RESET_POST_NUM" });
    }
  }, [dispatch, postNum, setCurrentPage, divisor, navigator, postId]);

  const searchByTitle = useCallback(
    (title: string, postId: number) => {
      setPostId(postId);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: title,
        searchOption,
        postId,
      });
    },
    [dispatch]
  );

  return (
    <PostsContainer>
      <Heading>좋아요 한 글</Heading>
      <MyPostListRenderer
        items={posts}
        onItemClick={(title, postId) => searchByTitle(title, postId)}
      />
      {hasMore && <MoreButton onClick={fetchMoreLikePosts}>더 보기</MoreButton>}
    </PostsContainer>
  );
};

export default MyLikes;

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    width: 100%;
  }
`;
