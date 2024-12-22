import React from "react";
import styled from "styled-components";
import { usePagination } from "./PaginationProvider";
import { useNavigate } from "react-router-dom";

const SearchedPagination = ({
  totalSearchedPosts,
  searchText,
  searchOption,
}: {
  totalSearchedPosts: number;
  searchText: string;
  searchOption: string;
}) => {
  const navigator = useNavigate();
  const { searchedCurrentPage, searchedPostsPerPage, setSearchedCurrentPage } =
    usePagination();

  const searchedTotalPages = Math.ceil(
    totalSearchedPosts / searchedPostsPerPage
  );

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    params.set("searchText", searchText);
    params.set("searchOption", searchOption);
    params.set("page", number.toString());
    navigator({
      pathname: "/search",
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    setSearchedCurrentPage(number);
    setParams(number);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <PaginationContainer>
      <ul>
        {[...Array(searchedTotalPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === searchedCurrentPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
            </PageButton>
          </PageItem>
        ))}
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
    gap: 5px;
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
