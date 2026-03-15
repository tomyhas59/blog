import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as S from "./SortButtonStyles";
import { usePagination } from "../../../../hooks/PaginationProvider";

const SortButton = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const { sortBy, setSortBy, setCurrentPage } = usePagination();

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    updateUrlParams(newSortBy);
  };

  const updateUrlParams = (newSortBy: string) => {
    const params = new URLSearchParams(location.search);
    params.set("page", "1");
    params.set("sortBy", newSortBy);
    navigator({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const sortOptions = [
    { value: "recent", label: "최신순" },
    { value: "view", label: "조회순" },
    { value: "popular", label: "인기순" },
    { value: "comment", label: "댓글순" },
  ];

  return (
    <S.SortContainer>
      {sortOptions.map(({ value, label }, index) => (
        <React.Fragment key={value}>
          <S.SortOption checked={sortBy === value}>
            <S.HiddenRadio
              type="radio"
              name="sort"
              value={value}
              checked={sortBy === value}
              onChange={() => handleSortChange(value)}
            />
            <span>{label}</span>
          </S.SortOption>
          {/* 마지막 아이템 뒤에는 구분선을 넣지 않음 */}
          {index < sortOptions.length - 1 && <S.Divider />}
        </React.Fragment>
      ))}
    </S.SortContainer>
  );
};

export default SortButton;
