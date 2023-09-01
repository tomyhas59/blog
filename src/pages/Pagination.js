import React from "react";
import styled from "styled-components";
import { usePagination } from "./PaginationProvider";

const Pagination = ({ totalPosts }) => {
  const { postsPerPage, currentPage, paginate } = usePagination(); 
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (number) => {
    paginate(number);
    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
  };

  return (
    <PaginationContainer>
      <ul>
        {pageNumbers.map((number) => (
          <PageItem key={number} isActive={number === currentPage}>
            <PageButton onClick={() => handlePageClick(number)}>
              {number}
            </PageButton>
          </PageItem>
        ))}
      </ul>
    </PaginationContainer>
  );
};

export default Pagination;

const PaginationContainer = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  ul {
    list-style: none;
    display: flex;
    gap: 5px;
  }
`;

const PageItem = styled.li`
  button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: ${(props) =>
      props.isActive ? props.theme.mainColor : "#fff"};
    color: ${(props) => (props.isActive ? "#fff" : "#333")};
    cursor: pointer;
  }
`;

const PageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
