import { useEffect, RefObject } from "react";

const useOutsideClick = (
  refs: RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        !refs.some(
          (ref) => ref.current && ref.current.contains(event.target as Node)
        )
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [refs, callback]);
};

export default useOutsideClick;
