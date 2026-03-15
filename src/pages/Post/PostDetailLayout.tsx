import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import Spinner from "../../components/ui/Spinner";
import PostDetail from "../../components/post/Items/PostDetail";

// 모든 상세 페이지 공통 컨테이너 스타일
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const PostDetailLayout = ({ children }: LayoutProps) => {
  const {
    removePostLoading,
    updatePostLoading,
    addCommentLoading,
    likePostLoading,
    unLikePostLoading,
    likeCommentLoading,
    unLikeCommentLoading,
    likeReplyLoading,
    unLikeReplyLoading,
    getCommentsLoading,
    getHashtagPostsLoading,
    searchedPostsLoading,
  } = useSelector((state: RootState) => state.post);

  // 세 페이지에서 발생하는 모든 로딩 상태를 하나로 통합
  const isLoading =
    removePostLoading ||
    updatePostLoading ||
    addCommentLoading ||
    likePostLoading ||
    unLikePostLoading ||
    likeCommentLoading ||
    unLikeCommentLoading ||
    likeReplyLoading ||
    unLikeReplyLoading ||
    getCommentsLoading ||
    getHashtagPostsLoading ||
    searchedPostsLoading;

  return (
    <Container>
      {isLoading && <Spinner />}
      <PostDetail />
      {children}
    </Container>
  );
};

export default PostDetailLayout;
