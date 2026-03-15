import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import MyPostListRenderer from "../../../components/renderer/MyPostListRenderer";
import { usePagination } from "../../../hooks/PaginationProvider";

// 전용 스타일 임포트
import * as S from "./MyPostsStyles";

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

  // 초기 게시글 로드
  useEffect(() => {
    if (!me) return;
    const getUserPosts = async () => {
      if (me?.id) {
        try {
          const response = await axios.get(`/post?userId=${me.id}`);
          setPosts(response.data.posts);
          setHasMore(response.data.hasMore);
          setPage(2);
        } catch (error) {
          console.error("내가 쓴 글 로드 실패:", error);
        }
      }
    };
    getUserPosts();
  }, [me]);

  // 다음 페이지 게시글 불러오기 (무한 스크롤 또는 더 보기 전용)
  const fetchMorePosts = async () => {
    if (!me || !hasMore) return;

    try {
      const response = await axios.get(
        `/post?userId=${me.id}&page=${page}&limit=5`,
      );
      const newPosts = response.data.posts;

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("추가 게시글 로드 실패:", error);
    }
  };

  // 게시글 클릭 시 검색 처리 및 페이지 이동
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
    (title: string, targetPostId: number) => {
      setPostId(targetPostId);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: title,
        searchOption,
        postId: targetPostId,
      });
    },
    [dispatch, searchOption],
  );

  return (
    <S.PostsWrapper>
      <S.PostsHeading>내가 쓴 글</S.PostsHeading>

      <MyPostListRenderer
        items={posts}
        onItemClick={(title, id) => searchByTitle(title, id)}
      />

      {hasMore && (
        <S.LoadMoreBtn onClick={fetchMorePosts}>게시글 더 보기</S.LoadMoreBtn>
      )}
    </S.PostsWrapper>
  );
};

export default MyPosts;
