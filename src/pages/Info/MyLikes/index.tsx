import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../reducer";
import { PostType } from "../../../types";
import { SEARCH_POSTS_REQUEST } from "../../../reducer/post";
import MyPostListRenderer from "../../../components/renderer/MyPostListRenderer";
import { usePagination } from "../../../hooks/PaginationProvider";

// 새롭게 만든 전용 스타일 임포트
import * as S from "./MyLikesStyles";

const MyLikes: React.FC = () => {
  const [posts, setLikedPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { me } = useSelector((state: RootState) => state.user);
  const { postNum } = useSelector((state: RootState) => state.post);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "title";

  const [postId, setPostId] = useState<number | null>(null);
  const { divisor, setCurrentPage } = usePagination();

  // 초기 좋아요 목록 로드
  useEffect(() => {
    const getUserLikes = async () => {
      if (me?.id) {
        try {
          const response = await axios.get(`/post/likers?userId=${me.id}`);
          setLikedPosts(response.data.likedPosts);
          setHasMore(response.data.hasMore);
          setPage(2);
        } catch (error) {
          console.error("좋아요 목록 로드 실패:", error);
        }
      }
    };
    getUserLikes();
  }, [me]);

  // 추가 페이지 로드 (더 보기)
  const fetchMoreLikePosts = async () => {
    if (!me || !hasMore) return;

    try {
      const response = await axios.get(
        `/post/likers?userId=${me.id}&page=${page}&limit=5`,
      );
      const newLikePosts = response.data.likedPosts;

      setLikedPosts((prev) => [...prev, ...newLikePosts]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("추가 목록 로드 실패:", error);
    }
  };

  // 게시글 클릭 시 해당 페이지 계산 후 이동
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
    (title: string, targetPostId: number) => {
      setPostId(targetPostId);
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: title,
        searchOption,
        postId: targetPostId,
      });
    },
    [dispatch],
  );

  return (
    <S.LikesWrapper>
      <S.LikesHeader>좋아요 한 글</S.LikesHeader>

      <S.ListSection>
        <MyPostListRenderer
          items={posts}
          onItemClick={(title, id) => searchByTitle(title, id)}
        />
      </S.ListSection>

      {hasMore && (
        <S.FetchButton onClick={fetchMoreLikePosts}>
          좋아요 한 글 더 보기
        </S.FetchButton>
      )}
    </S.LikesWrapper>
  );
};

export default MyLikes;
