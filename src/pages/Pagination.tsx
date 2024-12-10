import React from "react";
import styled from "styled-components";
import { usePagination } from "./PaginationProvider";
import { useNavigate } from "react-router-dom";

const Pagination = ({ totalPosts }: { totalPosts: number }) => {
  const { postsPerPage, currentPage, paginate } = usePagination();
  const pageNumbers = [];
  const navigator = useNavigate();
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    console.log(totalPosts, postsPerPage, totalPosts / postsPerPage);
    pageNumbers.push(i);
  }

  const onPageClick = (number: number) => {
    paginate(number);
    navigator("/");
  };

  return (
    <PaginationContainer>
      <ul>
        {pageNumbers.map((number) => (
          <PageItem key={number} isActive={number === currentPage}>
            <PageButton onClick={() => onPageClick(number)}>
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
  }
`;

const PageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
