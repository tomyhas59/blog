import React from "react";
import PostForm from "../components/PostForm";
import { useEffect } from "react";
import Post from "../components/Post";

const Main = () => {
  useEffect(() => {
    function onScroll() {
      console.log(
        window.screenY,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight
      );
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <PostForm />
      <br />
      <Post />
    </>
  );
};

export default Main;
