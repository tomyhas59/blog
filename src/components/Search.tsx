import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../reducer";
import { useLocation } from "react-router-dom";
import { usePagination } from "../hooks/PaginationProvider";
import useSetParams from "../hooks/useSetParams";

const Search = () => {
  const [searchOption, setSearchOption] = useState("all");
  const [searchText, setSearchText] = useState("");

  const { searchedPostsError } = useSelector((state: RootState) => state.post);
  const location = useLocation();
  const { setSearchedCurrentPage } = usePagination();

  const setParams = useSetParams({
    searchOption,
    page: 1,
  });

  const handleSearchWithOptions = useCallback(() => {
    if (!searchText.trim()) {
      return alert("찾을 단어를 입력해 주세요");
    }
    setSearchText("");
    setParams({ searchText });
    setSearchedCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
  }, [searchText, setSearchedCurrentPage, setParams]);

  useEffect(() => {
    if (searchedPostsError) {
      alert(searchedPostsError);
      setSearchText("");
    }
  }, [searchedPostsError]);

  const handleEnterKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearchWithOptions();
      }
    },
    [handleSearchWithOptions]
  );

  return (
    <SearchContainer currentPath={location.pathname}>
      <Select
        value={searchOption}
        onChange={(e) => setSearchOption(e.target.value)}
      >
        <option value="all">전체</option>
        <option value="author">글쓴이</option>
      </Select>
      <Input
        placeholder="검색"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={(e) => handleEnterKeyPress(e)}
      />
      <SearchButton onClick={handleSearchWithOptions}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SearchButton>
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div<{ currentPath: string }>`
  display: grid;
  width: 500px;
  grid-template-columns: 15% 75% 10%;
  @media (max-width: 480px) {
    width: 330px;
    grid-area: d;
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
