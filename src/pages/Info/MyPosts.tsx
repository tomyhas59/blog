import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { PostType } from "../../types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../../reducer/post";
import ContentRenderer from "../../components/ContentRenderer";

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
    [dispatch]
  );

  return (
    <PostsContainer>
      <Heading>◈내가 쓴 글◈</Heading>
      {posts.length > 0 ? (
        <PostList>
          {posts.map((post) => (
            <PostItem key={post.id} onClick={() => onSearch(post.content)}>
              <ContentRenderer content={post.content} />
            </PostItem>
          ))}
        </PostList>
      ) : (
        <div>작성한 글이 없습니다</div>
      )}
    </PostsContainer>
  );
};

export default MyPosts;

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostItem = styled.li`
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.mainColor};
  }
`;

const PostContent = styled.button`
  margin: 0;
  font-size: 16px;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;
`;
