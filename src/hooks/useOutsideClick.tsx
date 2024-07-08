import { useEffect, RefObject } from "react";

const useOutsideClick = (
  refs: RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.some(
          (ref) => ref.current && !ref.current.contains(event.target as Node)
        )
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useOutsideClick;
