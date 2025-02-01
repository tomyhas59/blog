import React from "react";
import styled from "styled-components";
import { usePagination } from "../../hooks/PaginationProvider";
import { PostType } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";

interface propsType {
  post: PostType;
  totalCommentPages: number;
  scrollTargetRef: React.RefObject<HTMLElement>;
}

const CommnetPagination = ({
  post,
  totalCommentPages,
  scrollTargetRef,
}: propsType) => {
  const { currentPage, currentCommentsPage, setCurrentCommentsPage, sortBy } =
    usePagination();

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

    const pathname = searchOptiontParam
      ? `/searchedPost/${post.id}`
      : `/post/${post.id}`;

    navigator({
      pathname,
      search: params.toString(),
    });
  };

  const onPageClick = (number: number) => {
    setCurrentCommentsPage(number);
    setParams(number);

    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({
        behavior: "auto",
        block: "start", // 상단에 위치하게
      });
    }
  };

  return (
    <PaginationContainer>
      {totalCommentPages > 0 && totalCommentPages !== 1 && (
        <ul>
          <li
            onClick={() =>
              currentCommentsPage > 1 && onPageClick(currentCommentsPage - 1)
            }
          >
            ◀
          </li>
          {[...Array(totalCommentPages)].map((_, index) => (
            <PageItem key={index} isActive={index + 1 === currentCommentsPage}>
              <PageButton onClick={() => onPageClick(index + 1)}>
                {index + 1}
              </PageButton>
            </PageItem>
          ))}
          <li
            onClick={() =>
              currentCommentsPage < totalCommentPages &&
              onPageClick(currentCommentsPage + 1)
            }
          >
            ▶
          </li>
        </ul>
      )}
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
