import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import MyPostListRenderer from "../../../components/renderer/MyPostListRenderer";
import { usePagination } from "../../../hooks/PaginationProvider";

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

  // 다음 페이지 게시글 불러오기
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
    <S.Container>
      <S.Header>
        <S.Title>
          <i className="fas fa-edit"></i>
          내가 쓴 글
        </S.Title>
        <S.Count>{posts.length}</S.Count>
      </S.Header>

      {posts.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>
            <i className="far fa-file-alt"></i>
          </S.EmptyIcon>
          <S.EmptyText>작성한 글이 없습니다</S.EmptyText>
        </S.EmptyState>
      ) : (
        <>
          <MyPostListRenderer
            items={posts}
            onItemClick={(title, id) => searchByTitle(title, id)}
          />

          {hasMore && (
            <S.LoadMoreButton onClick={fetchMorePosts}>
              <i className="fas fa-plus-circle"></i>
              게시글 더 보기
            </S.LoadMoreButton>
          )}
        </>
      )}
    </S.Container>
  );
};

export default MyPosts;
