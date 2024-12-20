import React, { createContext, useContext, useState } from "react";

const PaginationContext = createContext<any>({});

export const PaginationProvider = ({ children }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchedCurrentPage, setSearchedCurrentPage] = useState(1);
  const [searchedPostsPerPage] = useState(10);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const searchedPaginate = (pageNumber: number) => {
    setSearchedCurrentPage(pageNumber);
  };

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        postsPerPage,
        paginate,
        searchedCurrentPage,
        searchedPostsPerPage,
        searchedPaginate,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  return useContext(PaginationContext);
};
