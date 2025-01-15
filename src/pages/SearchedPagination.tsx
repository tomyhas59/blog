import React from "react";
import styled from "styled-components";
import { usePagination } from "../hooks/PaginationProvider";
import { useLocation, useNavigate } from "react-router-dom";

const SearchedPagination = ({
  totalSearchedPosts,
  searchText,
  searchOption,
}: {
  totalSearchedPosts: number;
  searchText: string;
  searchOption: string;
}) => {
  const location = useLocation();
  const navigator = useNavigate();
  const {
    searchedCurrentPage,
    searchedPostsPerPage,
    setSearchedCurrentPage,
    currentCommentsPage,
  } = usePagination();

  const searchedTotalPages = Math.ceil(
    totalSearchedPosts / searchedPostsPerPage
  );

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    params.set("searchText", searchText);
    params.set("searchOption", searchOption);
    params.set("page", number.toString());
    params.set("cPage", currentCommentsPage);
    navigator({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    setSearchedCurrentPage(number);
    setParams(number);
  };

  return (
    <PaginationContainer>
      <ul>
        <li
          onClick={() =>
            searchedCurrentPage > 1 && onPageClick(searchedCurrentPage - 1)
          }
        >
          ◀
        </li>
        {[...Array(searchedTotalPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === searchedCurrentPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
            </PageButton>
          </PageItem>
        ))}
        <li
          onClick={() =>
            searchedCurrentPage < searchedTotalPages &&
            onPageClick(searchedCurrentPage + 1)
          }
        >
          ▶
        </li>
      </ul>
    </PaginationContainer>
  );
};

export default SearchedPagination;

const PaginationContainer = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 5px;

  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  li {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.mainColor};
    }
  }
`;

type PageItemProps = {
  isActive: boolean;
};

const PageItem = styled.li<PageItemProps>`
  button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: ${(props) =>
      props.isActive ? props.theme.mainColor : "#fff"};
    color: ${(props) => (props.isActive ? "#fff" : "#333")};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => !props.isActive && "#D3D3D3"};
    }
  }
`;

const PageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
