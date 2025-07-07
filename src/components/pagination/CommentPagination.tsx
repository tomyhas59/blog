import React from "react";
import styled from "styled-components";
import { usePagination } from "../../hooks/PaginationProvider";
import { PostType } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";

interface propsType {
  post: PostType;
  totalCommentPagesCount: number;
  scrollTargetRef: React.RefObject<HTMLElement>;
}

const CommentPagination = ({
  post,
  totalCommentPagesCount,
  scrollTargetRef,
}: propsType) => {
  const { currentPage, currentCommentsPage, setCurrentCommentsPage, sortBy } =
    usePagination();

  const location = useLocation();
  const navigator = useNavigate();

  const setParams = (number: number) => {
    const params = new URLSearchParams(location.search);
    const hashtagNameParam = params.get("hashtagName");
    const searchTextParam = params.get("searchText");
    const searchOptionParam = params.get("searchOption");
    let pathname;

    //hashtag 있으면 해시태그 페이지
    if (hashtagNameParam) {
      params.set("hashtagName", hashtagNameParam);
      pathname = `/hashtagPost/${post.id}`;
    } else {
      if (searchTextParam) params.set("searchText", searchTextParam);
      if (searchOptionParam) params.set("searchOption", searchOptionParam);
      params.set("sortBy", sortBy);
      pathname = searchOptionParam
        ? `/searchedPost/${post.id}`
        : `/post/${post.id}`;
    }
    params.set("page", currentPage.toString());
    params.set("cPage", number.toString());

    navigator({
      pathname,
      search: params.toString(),
    });
  };

  const handlePageChange = (number: number) => {
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
      {totalCommentPagesCount > 0 && totalCommentPagesCount !== 1 && (
        <ul>
          <li
            onClick={() =>
              currentCommentsPage > 1 &&
              handlePageChange(currentCommentsPage - 1)
            }
          >
            ◀
          </li>
          {[...Array(totalCommentPagesCount)].map((_, index) => (
            <PageItem key={index} isActive={index + 1 === currentCommentsPage}>
              <PageButton onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PageButton>
            </PageItem>
          ))}
          <li
            onClick={() =>
              currentCommentsPage < totalCommentPagesCount &&
              handlePageChange(currentCommentsPage + 1)
            }
          >
            ▶
          </li>
        </ul>
      )}
    </PaginationContainer>
  );
};

export default CommentPagination;

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
