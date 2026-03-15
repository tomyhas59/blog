import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/PaginationProvider";
import * as S from "./PaginationStyles";

const HashtagPagination = ({
  totalHashtagPostsCount,
  hashtagName,
}: {
  totalHashtagPostsCount: number;
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
  const hashtagTotalPages = Math.ceil(
    totalHashtagPostsCount / hashtagPostsPerPage,
  );

  if (hashtagTotalPages <= 1) return null;

  const handlePageChange = (number: number) => {
    setHashtagCurrentPage(number);
    const params = new URLSearchParams();
    params.set("HashtagName", hashtagName);
    params.set("page", number.toString());
    params.set("cPage", currentCommentsPage.toString());
    navigator({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <S.PaginationNav>
      <ul>
        <S.PageStepButton
          disabled={hashtagCurrentPage <= 1}
          onClick={() =>
            hashtagCurrentPage > 1 && handlePageChange(hashtagCurrentPage - 1)
          }
        >
          ◀
        </S.PageStepButton>
        {[...Array(hashtagTotalPages)].map((_, i) => (
          <S.PageNumberItem key={i} isActive={i + 1 === hashtagCurrentPage}>
            <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
          </S.PageNumberItem>
        ))}
        <S.PageStepButton
          disabled={hashtagCurrentPage >= hashtagTotalPages}
          onClick={() =>
            hashtagCurrentPage < hashtagTotalPages &&
            handlePageChange(hashtagCurrentPage + 1)
          }
        >
          ▶
        </S.PageStepButton>
      </ul>
    </S.PaginationNav>
  );
};
export default HashtagPagination;
