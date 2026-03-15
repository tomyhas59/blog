import React from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/PaginationProvider";
import * as S from "./PaginationStyles";

const Pagination = ({ totalPostsCount }: { totalPostsCount: number }) => {
  const navigator = useNavigate();
  const { currentPage, divisor, setCurrentPage, sortBy, currentCommentsPage } =
    usePagination();
  const totalPagesCount = Math.ceil(totalPostsCount / divisor);

  if (totalPagesCount <= 1) return null;

  const handlePageChange = (number: number) => {
    setCurrentPage(number);
    const params = new URLSearchParams();
    params.set("page", number.toString());
    params.set("sortBy", sortBy);
    params.set("cPage", currentCommentsPage.toString());
    navigator({ pathname: "/", search: params.toString() });
  };

  return (
    <S.PaginationNav>
      <ul>
        <S.PageStepButton
          disabled={currentPage <= 1}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        >
          ◀
        </S.PageStepButton>
        {[...Array(totalPagesCount)].map((_, i) => (
          <S.PageNumberItem key={i} isActive={i + 1 === currentPage}>
            <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
          </S.PageNumberItem>
        ))}
        <S.PageStepButton
          disabled={currentPage >= totalPagesCount}
          onClick={() =>
            currentPage < totalPagesCount && handlePageChange(currentPage + 1)
          }
        >
          ▶
        </S.PageStepButton>
      </ul>
    </S.PaginationNav>
  );
};
export default Pagination;
