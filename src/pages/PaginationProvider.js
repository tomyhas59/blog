// Create a PaginationContext.js file
import React, { createContext, useContext, useState } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3); // 페이지당 표시할 게시물 수

  const paginate = (pageNumber) => {
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
