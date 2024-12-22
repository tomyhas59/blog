import React, { createContext, useContext, useState } from "react";

const PaginationContext = createContext<any>({});

export const PaginationProvider = ({ children }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchedCurrentPage, setSearchedCurrentPage] = useState(1);
  const [searchedPostsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("recent");

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        postsPerPage,
        setSearchedCurrentPage,
        searchedCurrentPage,
        searchedPostsPerPage,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  return useContext(PaginationContext);
};
