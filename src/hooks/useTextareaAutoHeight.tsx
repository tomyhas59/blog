import { useEffect, RefObject } from "react";

// 외부로 분리된 resizeTextarea 함수
export const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

const useTextareaAutoHeight = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  editForm: Record<number, boolean> | boolean | null
) => {
  useEffect(() => {
    const onResize = () => {
      resizeTextarea(textareaRef.current);
    };

    if (textareaRef.current) {
      textareaRef.current.focus();
      onResize();
      textareaRef.current.addEventListener("input", onResize);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("input", onResize);
      }
    };
  }, [textareaRef, editForm]);

  return textareaRef;
};

export default useTextareaAutoHeight;
