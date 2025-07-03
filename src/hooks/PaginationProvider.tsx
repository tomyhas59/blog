import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaginationContext = createContext<any>({});

export const PaginationProvider = ({ children }: any) => {
  const location = useLocation();
  //main
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentCommentsPage, setCurrentCommentsPage] = useState<number>(1);
  //search
  const [searchedCurrentPage, setSearchedCurrentPage] = useState<number>(1);
  const [searchedPostsPerPage] = useState<number>(10);
  //hashtag
  const [hashtagCurrentPage, setHashtagCurrentPage] = useState<number>(1);
  const [hashtagPostsPerPage] = useState<number>(10);

  const [divisor] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    if (pageParam) setCurrentPage(Number(pageParam));
  }, [location.search]);

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        setCurrentCommentsPage,
        currentCommentsPage,
        divisor,
        setSearchedCurrentPage,
        searchedCurrentPage,
        searchedPostsPerPage,
        hashtagCurrentPage,
        setHashtagCurrentPage,
        hashtagPostsPerPage,
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
