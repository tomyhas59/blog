import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const { searchPosts, addPostDone, searchPostsLoading } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    if (addPostDone) {
      dispatch({
        type: "REFRESH",
      });

      navigator("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [addPostDone, dispatch, navigator]);

  return (
    <div>
      <PostForm />
      {searchPostsLoading ? (
        <Spinner />
      ) : (
        searchPosts.length > 0 && (
          <div>
            {searchPosts.map((post: PostType) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
