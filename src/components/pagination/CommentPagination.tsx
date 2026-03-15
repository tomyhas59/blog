import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/PaginationProvider";
import * as S from "./PaginationStyles";

const CommentPagination = ({
  post,
  totalCommentPagesCount,
  scrollTargetRef,
}: any) => {
  const { currentPage, currentCommentsPage, setCurrentCommentsPage } =
    usePagination();
  const location = useLocation();
  const navigator = useNavigate();

  if (totalCommentPagesCount <= 1) return null;

  const handlePageChange = (number: number) => {
    setCurrentCommentsPage(number);
    const params = new URLSearchParams(location.search);
    params.set("page", currentPage.toString());
    params.set("cPage", number.toString());
    navigator({ pathname: location.pathname, search: params.toString() });

    if (scrollTargetRef?.current) {
      scrollTargetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <S.PaginationNav>
      <ul>
        <S.PageStepButton
          disabled={currentCommentsPage <= 1}
          onClick={() =>
            currentCommentsPage > 1 && handlePageChange(currentCommentsPage - 1)
          }
        >
          ◀
        </S.PageStepButton>
        {[...Array(totalCommentPagesCount)].map((_, i) => (
          <S.PageNumberItem key={i} isActive={i + 1 === currentCommentsPage}>
            <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
          </S.PageNumberItem>
        ))}
        <S.PageStepButton
          disabled={currentCommentsPage >= totalCommentPagesCount}
          onClick={() =>
            currentCommentsPage < totalCommentPagesCount &&
            handlePageChange(currentCommentsPage + 1)
          }
        >
          ▶
        </S.PageStepButton>
      </ul>
    </S.PaginationNav>
  );
};
export default CommentPagination;
