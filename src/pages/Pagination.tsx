import React from "react";
import styled from "styled-components";
import { usePagination } from "./PaginationProvider";
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
  const { currentPage, postsPerPage, paginate } = usePagination();

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    params.set("page", number.toString());
    navigator({
      pathname: postId ? `/post/${postId}` : `${location.pathname}`,
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    paginate(number);
    setParams(number);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <PaginationContainer>
      <ul>
        {[...Array(totalPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === currentPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
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
