import React from "react";
import styled from "styled-components";
import { usePagination } from "../hooks/PaginationProvider";

const CommnetPagination = ({ totalComments }: { totalComments: number }) => {
  const { currentCommentsPage, divisor, setCurrentCommentsPage } =
    usePagination();

  const totalPages = Math.ceil(totalComments / divisor);

  const onPageClick = (number: number) => {
    setCurrentCommentsPage(number);
  };

  return (
    <PaginationContainer>
      <ul>
        <li
          onClick={() =>
            currentCommentsPage > 1 && onPageClick(currentCommentsPage - 1)
          }
        >
          ◀
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === currentCommentsPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
            </PageButton>
          </PageItem>
        ))}
        <li
          onClick={() =>
            currentCommentsPage < totalPages &&
            onPageClick(currentCommentsPage + 1)
          }
        >
          ▶
        </li>
      </ul>
    </PaginationContainer>
  );
};

export default CommnetPagination;

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
