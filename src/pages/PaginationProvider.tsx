import React, { createContext, useContext, useState } from "react";

const PaginationContext = createContext<any>({});

export const PaginationProvider = ({ children }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // 페이지당 표시할 게시물 수

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PaginationContext.Provider value={{ currentPage, postsPerPage, paginate }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  return useContext(PaginationContext);
};
