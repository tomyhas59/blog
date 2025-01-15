import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { usePagination } from "../hooks/PaginationProvider";
import { CommentType, PostType } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

interface propsType {
  post: PostType;
  totalComments: number;
  setCurrentComments: Dispatch<SetStateAction<CommentType[]>>;
  getCurrentComments: () => CommentType[];
}

const CommnetPagination = ({
  post,
  totalComments,
  setCurrentComments,
  getCurrentComments,
}: propsType) => {
  const {
    currentPage,
    currentCommentsPage,
    divisor,
    setCurrentCommentsPage,
    sortBy,
  } = usePagination();

  const totalCommentPages = Math.ceil(totalComments / divisor);
  const location = useLocation();
  const navigator = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchTextParam = params.get("searchText");
  const searchOptiontParam = params.get("searchOption");

  const setParams = (number: number) => {
    const params = new URLSearchParams();
    if (searchTextParam) params.set("searchText", searchTextParam);
    if (searchOptiontParam) params.set("searchOption", searchOptiontParam);
    params.set("page", currentPage.toString());
    params.set("sortBy", sortBy);
    params.set("cPage", number.toString());

    const pathname = post.id ? `/searchedPost/${post.id}` : `/search`;

    navigator({
      pathname,
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    setCurrentCommentsPage(number);
    const currentComments = getCurrentComments();
    setCurrentComments(currentComments);
    setParams(number);
  };

  return (
    <PaginationContainer>
      <ul>
        {totalComments > 0 && (
          <li
            onClick={() =>
              currentCommentsPage > 1 && onPageClick(currentCommentsPage - 1)
            }
          >
            ◀
          </li>
        )}
        {[...Array(totalCommentPages)].map((_, index) => (
          <PageItem key={index} isActive={index + 1 === currentCommentsPage}>
            <PageButton onClick={() => onPageClick(index + 1)}>
              {index + 1}
            </PageButton>
          </PageItem>
        ))}
        {totalComments > 0 && (
          <li
            onClick={() =>
              currentCommentsPage < totalCommentPages &&
              onPageClick(currentCommentsPage + 1)
            }
          >
            ▶
          </li>
        )}
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
