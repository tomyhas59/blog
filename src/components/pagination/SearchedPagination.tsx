import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/PaginationProvider";
import * as S from "./PaginationStyles";

const SearchedPagination = ({
  totalSearchedPostsCount,
  searchText,
  searchOption,
}: any) => {
  const location = useLocation();
  const navigator = useNavigate();
  const {
    searchedCurrentPage,
    searchedPostsPerPage,
    setSearchedCurrentPage,
    currentCommentsPage,
  } = usePagination();
  const searchedTotalPagesCount = Math.ceil(
    totalSearchedPostsCount / searchedPostsPerPage,
  );

  if (searchedTotalPagesCount <= 1) return null;

  const handlePageChange = (number: number) => {
    setSearchedCurrentPage(number);
    const params = new URLSearchParams();
    params.set("searchText", searchText);
    params.set("searchOption", searchOption);
    params.set("page", number.toString());
    params.set("cPage", currentCommentsPage.toString());
    navigator({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <S.PaginationNav>
      <ul>
        <S.PageStepButton
          disabled={searchedCurrentPage <= 1}
          onClick={() =>
            searchedCurrentPage > 1 && handlePageChange(searchedCurrentPage - 1)
          }
        >
          ◀
        </S.PageStepButton>
        {[...Array(searchedTotalPagesCount)].map((_, i) => (
          <S.PageNumberItem key={i} isActive={i + 1 === searchedCurrentPage}>
            <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
          </S.PageNumberItem>
        ))}
        <S.PageStepButton
          disabled={searchedCurrentPage >= searchedTotalPagesCount}
          onClick={() =>
            searchedCurrentPage < searchedTotalPagesCount &&
            handlePageChange(searchedCurrentPage + 1)
          }
        >
          ▶
        </S.PageStepButton>
      </ul>
    </S.PaginationNav>
  );
};
export default SearchedPagination;
