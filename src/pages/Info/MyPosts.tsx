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
import InfiniteScroll from "react-infinite-scroll-component";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { me } = useSelector((state: RootState) => state.user);
  const { postNum } = useSelector((state: RootState) => state.post);
  const [postId, setPostId] = useState<number | null>(null);

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "title";
  const { divisor, setCurrentPage } = usePagination();

  useEffect(() => {
    const getUserPosts = async () => {
      if (me?.id) {
        try {
          // 게시글 1페이지 불러오기
          const response = await axios.get(`/post?userId=${me.id}`);
          setPosts(response.data.posts);
          setHasMore(response.data.hasMore);
          setPage(2);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserPosts();
  }, [me]);

  // 다음 페이지 게시글 불러오기 함수
  const fetchMorePosts = async () => {
    if (!me || !hasMore) return;

    try {
      const response = await axios.get(
        `/post?userId=${me.id}&page=${page}&limit=5`
      );
      const newPosts = response.data.posts;

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (postNum && postId !== null) {
      const searchedPostPage = Math.floor(Number(postNum) / divisor) + 1;
      setCurrentPage(searchedPostPage);
      navigator(`/post/${postId}`);
      window.scrollTo({ top: 0, behavior: "auto" });

      dispatch({ type: "RESET_NUM" });
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
    [dispatch, searchOption]
  );

  return (
    <PostsContainer>
      <Heading>내가 쓴 글</Heading>
      <MyPostListRenderer
        items={posts}
        onItemClick={(title, postId) => searchByTitle(title, postId)}
      />
      {hasMore && <MoreButton onClick={fetchMorePosts}>더 보기</MoreButton>}
    </PostsContainer>
  );
};

export default MyPosts;

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  overflow-y: scroll;
  @media (max-width: 768px) {
    padding: 10px;
    width: 100%;
  }
`;

export const Heading = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.mainColor};
  width: fit-content;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const MoreButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 12px 24px;
  color: white;
  background-color: ${(props) => props.theme.mainColor};
  border: none;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    transform: translateY(-2px);
  }
`;
