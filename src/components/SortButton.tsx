import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePagination } from "../pages/PaginationProvider";

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
    { value: "popular", label: "인기순" },
    { value: "comment", label: "댓글순" },
  ];

  return (
    <SortButtons>
      {sortOptions.map(({ value, label }) => (
        <SortLabel key={value}>
          <input
            type="radio"
            name="sort"
            value={value}
            checked={sortBy === value}
            onChange={() => handleSortChange(value)}
          />
          {label}
        </SortLabel>
      ))}
    </SortButtons>
  );
};

export default SortButton;

const SortButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  input {
    margin-right: 4px;
  }
`;
