import React from "react";
import styled from "styled-components";
import { usePagination } from "./PaginationProvider";
import { useDispatch } from "react-redux";

const Pagination = ({ totalPosts }: { totalPosts: number }) => {
  const { postsPerPage, currentPage, paginate } = usePagination();
  const pageNumbers = [];
  const dispatch = useDispatch();
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (number: number) => {
    paginate(number);
    dispatch({
      type: "REFRESH", //새로 고침
    });
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
