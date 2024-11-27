import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import { PostType } from "../types";
import Spinner from "../components/Spinner";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const {
    searchPosts,
    searchNicknameError,
    imagePaths,
    addPostDone,
    searchPostsLoading,
  } = useSelector((state: RootState) => state.post);
  const { currentPage, postsPerPage, paginate } = usePagination();

  useEffect(() => {
    if (searchNicknameError) {
      alert(searchNicknameError);
    }
  }, [searchNicknameError]);

  useEffect(() => {
    if (addPostDone) {
      dispatch({
        type: "REFRESH",
      });
      paginate(1);
      navigator("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [addPostDone, dispatch, paginate, navigator]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchPosts.slice(indexOfFirstPost, indexOfLastPost);

  console.log(searchPosts);
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
                <Post post={post} imagePaths={imagePaths} />
              </div>
            ))}
            <Pagination totalPosts={searchPosts.length} />
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
