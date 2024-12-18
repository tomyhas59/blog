import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_POSTS_REQUEST } from "../reducer/post";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../reducer";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../pages/PaginationProvider";
import useSetParams from "../hooks/useSetParams";

const Search = () => {
  const [searchOption, setSearchOption] = useState("all");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { searchedPostsError } = useSelector((state: RootState) => state.post);
  const navigator = useNavigate();
  const location = useLocation();
  const { searchedPaginate } = usePagination();

  const setParams = useSetParams({
    searchText,
    searchOption,
    page: 1,
  });

  const onSearch = useCallback(() => {
    if (!searchText.trim()) {
      return alert("찾을 단어를 입력해 주세요");
    }
    setSearchText("");
    setParams({ searchText });
    searchedPaginate(1);
    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
  }, [dispatch, searchOption, searchText, setParams]);

  useEffect(() => {
    if (searchedPostsError) {
      alert(searchedPostsError);
      setSearchText("");
    }
  }, [searchedPostsError]);

  const onEnterKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <Container currentPath={location.pathname}>
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
        onKeyUp={(e) => onEnterKeyPress(e)}
      />
      <SearchButton onClick={onSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SearchButton>
    </Container>
  );
};

export default Search;

const Container = styled.div<{ currentPath: string }>`
  display: grid;
  width: 500px;
  height: 1.5rem;
  grid-template-columns: 15% 75% 10%;

  @media (max-width: 680px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    display: ${({ currentPath }) =>
      currentPath === "/" || currentPath.includes("/search") ? "grid" : "none"};
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
