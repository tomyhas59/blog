import React, { useCallback, useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import { ALL_POSTS_REQUEST, SEARCH_POSTS_REQUEST } from "../reducer/post";
import Pagination from "./Pagination";
import styled from "styled-components";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Main = () => {
  const dispatch = useDispatch();
  const { allPosts, searchPosts, searchPostsError } = useSelector(
    (state) => state.post
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3); // 페이지당 표시할 게시물 수

  useEffect(() => {
    if (allPosts.length === 0) {
      // 초기 게시물 불러오기
      dispatch({
        type: ALL_POSTS_REQUEST,
      });
    }
  }, [allPosts.length, dispatch]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(() => {
    if (!searchText) {
      alert("찾을 단어를 입력해 주세요");
    }
    if (searchText.trim() !== "") {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        query: searchText,
      });
    } // 검색 액션을 디스패치
    setSearchText("");
  }, [dispatch, searchText]);

  useEffect(() => {
    if (searchPostsError) {
      alert("찾을 수 없습니다");
      setSearchText("");
    }
  }, [searchPostsError]);

  const Enter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div>
      <PostForm />
      <SearchFormWrapper>
        <SearchForm>
          <Input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={(e) => Enter(e)}
          />
          <Button onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
        </SearchForm>
      </SearchFormWrapper>
      {searchPosts.length > 0 ? (
        <div>
          {searchPosts.map((post) => (
            <div>
              <Post post={post} />
              <Divider />
            </div>
          ))}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={searchPosts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <>
          {currentPosts.map((post) => (
            <div key={post.id}>
              <Post post={post} />
              <Divider />
            </div>
          ))}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={allPosts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default Main;

const SearchFormWrapper = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
`;

const SearchForm = styled.div`
  position: absolute;
  right: 20%;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;
