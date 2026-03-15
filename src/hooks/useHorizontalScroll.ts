import { useEffect } from "react";

const useHorizontalScroll = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current; // 1. ref.current를 변수에 복사

    if (element) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        element.scrollTo({
          left: element.scrollLeft + e.deltaY,
          behavior: "smooth",
        });
      };

      element.addEventListener("wheel", onWheel);
      return () => element.removeEventListener("wheel", onWheel); // 2. 복사한 변수로 클린업
    }
  }, [ref]); // 3. 이제 ref를 넣어줘도 ESLint가 안심합니다.

  return ref;
};

export default useHorizontalScroll;
