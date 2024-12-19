import { useEffect, RefObject } from "react";

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
    const currentTextarea = textareaRef.current;

    const onResize = () => {
      resizeTextarea(currentTextarea);
    };

    if (currentTextarea) {
      onResize();
      textareaRef.current.addEventListener("input", onResize);
    }

    return () => {
      if (currentTextarea) {
        currentTextarea.removeEventListener("input", onResize);
      }
    };
  }, [textareaRef, editForm]);

  return textareaRef;
};

export default useTextareaAutoHeight;
