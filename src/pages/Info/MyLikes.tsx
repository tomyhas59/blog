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

const MyLikes: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "title";

  useEffect(() => {
    const getUserLikes = async () => {
      if (me?.id) {
        try {
          const response = await axios.get(`/post/likers?userId=${me.id}`);
          const posts = response.data.map(
            (item: { id: number; title: string; createdAt: string }) => ({
              id: item.id,
              title: item.title,
              createdAt: item.createdAt,
            })
          );
          console.log(response.data);
          setPosts(posts);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserLikes();
  }, [me]);

  const onSearch = useCallback(
    (title: string, postId: number) => {
      navigator("/search");
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: title,
        searchOption,
        postId,
      });
      navigator(`/post/${postId}`);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, navigator]
  );

  return (
    <PostsContainer>
      <Heading>◈좋아요 한 글◈</Heading>
      <MyPostListRenderer
        items={posts}
        onItemClick={(title, postId) => onSearch(title, postId)}
      />
    </PostsContainer>
  );
};

export default MyLikes;

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 10px;
    width: 100%;
  }
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;
