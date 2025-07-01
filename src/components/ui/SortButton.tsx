import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePagination } from "../../hooks/PaginationProvider";

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
    <SortButtons>
      {sortOptions.map(({ value, label }) => (
        <SortLabel key={value}>
          <HiddenRadio
            type="radio"
            name="sort"
            value={value}
            checked={sortBy === value}
            onChange={() => handleSortChange(value)}
          />
          <CustomRadio checked={sortBy === value} />
          <span>{label}</span>
        </SortLabel>
      ))}
    </SortButtons>
  );
};

export default SortButton;

const SortButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.7rem;
  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  position: relative;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
  }

  span {
    margin-left: 6px;
    font-size: 0.7rem;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const CustomRadio = styled.span<{ checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid
    ${(props) => (props.checked ? props.theme.mainColor : "#ccc")};
  border-radius: 50%;
  background-color: ${(props) =>
    props.checked ? props.theme.mainColor : "transparent"};
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: ${(props) => (props.checked ? "block" : "none")};
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: white;
  }
`;
