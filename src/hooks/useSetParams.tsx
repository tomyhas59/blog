import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface ParamsType {
  searchOption: string;
  page: number;
  postId?: number;
}

const useSetParams = ({ searchOption, page, postId }: ParamsType) => {
  const navigator = useNavigate();

  const setParams = useCallback(
    ({ searchText }: { searchText: string }) => {
      const params = new URLSearchParams();
      if (searchText) params.set("searchText", searchText);
      params.set("searchOption", searchOption);
      params.set("page", page.toString());
      const pathname = postId ? `/searchedPost/${postId}` : `/search`;

      navigator({
        pathname,
        search: params.toString(),
      });
    },
    [navigator, searchOption, page, postId]
  );

  return setParams;
};

export default useSetParams;
