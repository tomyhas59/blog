import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

import { RootState } from "../../reducer";
import { usePagination } from "../../hooks/PaginationProvider";
import useSetParams from "../../hooks/useSetParams";
import * as S from "./SearchStyles";

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

  // 검색 실행
  const handleSearchWithOptions = useCallback(() => {
    if (!searchText.trim()) {
      return alert("찾을 단어를 입력해 주세요");
    }
    // setSearchText(""); // 검색어 유지를 위해 주석 처리 또는 삭제
    setParams({ searchText });
    setSearchedCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [searchText, setSearchedCurrentPage, setParams]);

  // 검색어 초기화(X 버튼)
  const clearSearch = useCallback(() => {
    setSearchText("");
  }, []);

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
    [handleSearchWithOptions],
  );

  return (
    <S.SearchWrapper currentPath={location.pathname}>
      <S.SearchContainer>
        <S.Select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="author">글쓴이</option>
        </S.Select>

        <S.InputWrapper>
          <S.Input
            placeholder="어떤 정보를 찾으시나요?"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={handleEnterKeyPress}
          />

          {/* 검색어가 있을 때만 X 버튼 표시 */}
          {searchText && (
            <S.ClearButton onClick={clearSearch}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </S.ClearButton>
          )}

          <S.SearchButton onClick={handleSearchWithOptions}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </S.SearchButton>
        </S.InputWrapper>
      </S.SearchContainer>
    </S.SearchWrapper>
  );
};

export default Search;
