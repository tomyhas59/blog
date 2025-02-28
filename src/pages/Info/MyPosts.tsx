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

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
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
          const response = await axios.get(`/post?userId=${me.id}`);

          setPosts(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserPosts();
  }, [me]);

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
    [dispatch]
  );

  return (
    <PostsContainer>
      <Heading>내가 쓴 글</Heading>
      <MyPostListRenderer
        items={posts}
        onItemClick={(title, postId) => searchByTitle(title, postId)}
      />
    </PostsContainer>
  );
};

export default MyPosts;

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

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
