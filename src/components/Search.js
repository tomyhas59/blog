import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Search = ({ searchOption }) => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { searchPostsError } = useSelector((state) => state.post);

  const handleSearch = useCallback(() => {
    if (!searchText) {
      alert("찾을 단어를 입력해 주세요");
    }
    if (searchText.trim() !== "") {
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        query: searchText,
        searchOption,
      });
    } // 검색 액션을 디스패치
    setSearchText("");
    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
  }, [dispatch, searchOption, searchText]);

  useEffect(() => {
    if (searchPostsError) {
      alert(searchPostsError);
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
      <Input
        placeholder="검색"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={(e) => Enter(e)}
      />
      <Button onClick={handleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
    </div>
  );
};

export default Search;

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
