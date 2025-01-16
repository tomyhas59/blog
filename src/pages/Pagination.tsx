import React from "react";
import styled from "styled-components";
import { usePagination } from "../hooks/PaginationProvider";
import { useLocation, useNavigate } from "react-router-dom";

const Pagination = ({
  totalPosts,
  postId,
}: {
  totalPosts: number;
  postId?: number;
}) => {
  const location = useLocation();
  const navigator = useNavigate();
  const { currentPage, divisor, setCurrentPage, sortBy, currentCommentsPage } =
    usePagination();

  const totalPages = Math.ceil(totalPosts / divisor);

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    params.set("page", number.toString());
    params.set("sortBy", sortBy);
    params.set("cPage", currentCommentsPage);

    navigator({
      pathname: postId ? `/post/${postId}` : `${location.pathname}`,
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    setCurrentPage(number);
    setParams(number);
  };

  return (
    <PaginationContainer>
      <ul>
        {totalPages > 0 && (
          <li onClick={() => currentPage > 1 && onPageClick(currentPage - 1)}>
            ◀
          </li>
        )}

        {[...Array(totalPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === currentPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
            </PageButton>
          </PageItem>
        ))}
        {totalPages > 0 && (
          <li
            onClick={() =>
              currentPage < totalPages && onPageClick(currentPage + 1)
            }
          >
            ▶
          </li>
        )}
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
