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
    { value: "recent", label: "최신순", icon: "fa-clock" },
    { value: "view", label: "조회순", icon: "fa-eye" },
    { value: "popular", label: "인기순", icon: "fa-fire" },
    { value: "comment", label: "댓글순", icon: "fa-comments" },
  ];

  return (
    <S.SortContainer>
      {sortOptions.map(({ value, label, icon }) => (
        <S.SortOption
          key={value}
          checked={sortBy === value}
          onClick={() => handleSortChange(value)}
        >
          <S.HiddenRadio
            type="radio"
            name="sort"
            value={value}
            checked={sortBy === value}
            onChange={() => handleSortChange(value)}
          />
          <S.SortLabel>
            <i className={`fas ${icon}`}></i>
            <span>{label}</span>
          </S.SortLabel>
        </S.SortOption>
      ))}
    </S.SortContainer>
  );
};

export default SortButton;
