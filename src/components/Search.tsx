import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../reducer";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchOption, setSearchOption] = useState("author");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { searchPostsError } = useSelector((state: RootState) => state.post);
  const navigator = useNavigate();

  const onSearch = useCallback(() => {
    if (!searchText.trim()) {
      return alert("찾을 단어를 입력해 주세요");
    }

    navigator("/search");
    dispatch({
      type: SEARCH_POSTS_REQUEST,
      query: searchText,
      searchOption,
    });
    setSearchText("");

    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
  }, [dispatch, navigator, searchOption, searchText]);

  useEffect(() => {
    if (searchPostsError) {
      alert(searchPostsError);
      setSearchText("");
    }
  }, [searchPostsError]);

  const onEnterKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <Container>
      <Select
        value={searchOption}
        onChange={(e) => setSearchOption(e.target.value)}
      >
        <option value="author">글쓴이</option>
        <option value="all">전체</option>
      </Select>
      <Input
        placeholder="검색"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={(e) => onEnterKeyPress(e)}
      />
      <SearchButton onClick={onSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SearchButton>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  display: grid;
  width: 500px;
  height: 1.5rem;
  grid-template-columns: 15% 75% 10%;
  @media (max-width: 480px) {
    position: absolute;
    width: 250px;
    text-align: center;
    grid-template-columns: 30% 60% 10%;
    top: -30px;
    left: 0;
  }
`;

const Select = styled.select`
  text-align: center;
  border-radius: 4px;
  @media (max-width: 480px) {
    height: 30px;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-left: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  @media (max-width: 480px) {
    height: 30px;
  }
`;

const SearchButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  * {
    transition: transform 0.3s ease, color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
  @media (max-width: 480px) {
    height: 30px;
  }
`;
