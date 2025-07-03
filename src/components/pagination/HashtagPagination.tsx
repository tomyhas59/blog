import React from "react";
import styled from "styled-components";
import { usePagination } from "../../hooks/PaginationProvider";
import { useLocation, useNavigate } from "react-router-dom";

const HashtagPagination = ({
  totalHashtagPosts,
  hashtagName,
}: {
  totalHashtagPosts: number;
  hashtagName: string;
}) => {
  const location = useLocation();
  const navigator = useNavigate();
  const {
    hashtagCurrentPage,
    hashtagPostsPerPage,
    setHashtagCurrentPage,
    currentCommentsPage,
  } = usePagination();

  const hashtagTotalPages = Math.ceil(totalHashtagPosts / hashtagPostsPerPage);

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    params.set("HashtagName", hashtagName);
    params.set("page", number.toString());
    params.set("cPage", currentCommentsPage);
    navigator({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const handlePageChange = (number: number) => {
    setHashtagCurrentPage(number);
    setParams(number);
  };

  return (
    <PaginationContainer>
      {hashtagTotalPages > 0 && hashtagTotalPages !== 1 && (
        <ul>
          <li
            onClick={() =>
              hashtagCurrentPage > 1 && handlePageChange(hashtagCurrentPage - 1)
            }
          >
            ◀
          </li>
          {[...Array(hashtagTotalPages)].map((_, index) => (
            <PageItem key={index} isActive={index + 1 === hashtagCurrentPage}>
              <PageButton onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PageButton>
            </PageItem>
          ))}
          <li
            onClick={() =>
              hashtagCurrentPage < hashtagTotalPages &&
              handlePageChange(hashtagCurrentPage + 1)
            }
          >
            ▶
          </li>
        </ul>
      )}
    </PaginationContainer>
  );
};

export default HashtagPagination;

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
