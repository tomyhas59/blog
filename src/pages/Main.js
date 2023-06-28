import React from "react";
import PostForm from "../components/PostForm";
import { useEffect } from "react";
import Post from "../components/Post";
import Drag from "./Drag";
import { useDispatch, useSelector } from "react-redux";
import { ALL_POSTS_REQUEST } from "../reducer/post";

const Main = () => {
  const dispatch = useDispatch();
  const { allPosts } = useSelector((state) => state.post);

  useEffect(() => {
    if (allPosts.length === 0) {
      //렌더링 중복 방지
      dispatch({
        type: ALL_POSTS_REQUEST,
      });
    }
  }, [allPosts.length, dispatch]);

  return (
    <div>
      <PostForm />
      <br />
      {allPosts.length > 0 &&
        allPosts.map((post) => {
          console.log("Post ID:", post.id);
          return (
            <div key={post.id}>
              <Post post={post} />
              <Drag />
            </div>
          );
        })}
    </div>
  );
};

export default Main;
