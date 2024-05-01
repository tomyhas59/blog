import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../reducer";

const Search = () => {
  const [searchOption, setSearchOption] = useState("author");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { searchPostsError } = useSelector((state: RootState) => state.post);

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
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <Container>
      <Select
        value={searchOption}
        onChange={(e) => setSearchOption(e.target.value)}
      >
        <option value="author">글쓴이</option>
        <option value="content">내용</option>
        <option value="both">글쓴이+내용</option>
      </Select>
      <Input
        placeholder="검색"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={(e) => Enter(e)}
      />
      <SearchButton onClick={handleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SearchButton>
    </Container>
  );
};

export default Search;

const Select = styled.select`
  border-radius: 4px;
`;

const Container = styled.div`
  display: grid;
  height: 50px;
  grid-template-columns: 30% 50% 20%;
  & > select {
    text-align: center;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-left: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

const SearchButton = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.charColor};
  }
`;
