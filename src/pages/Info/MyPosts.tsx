import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { PostType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import ListRenderer from "../../components/renderer/ListRenderer";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const searchOption = "content";

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        if (me?.id) {
          const response = await axios.get(`/post?userId=${me.id}`);
          console.log(response.data);
          setPosts(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserPosts();
  }, [me]);

  const onSearch = useCallback(
    (content: string) => {
      navigator("/");
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        query: content,
        searchOption,
      });

      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, navigator]
  );

  return (
    <PostsContainer>
      <Heading>◈내가 쓴 글◈</Heading>
      <ListRenderer
        items={posts}
        onItemClick={(content) => onSearch(content)}
      />
    </PostsContainer>
  );
};

export default MyPosts;

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
