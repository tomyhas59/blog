import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ADD_POST_REQUEST } from "../../../../reducer/post";
import { RootState } from "../../../../reducer";
import Spinner from "../../../ui/Spinner";
import useTextareaAutoHeight from "../../../../hooks/useTextareaAutoHeight";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import * as S from "./PostFormStyles";

interface PostFormProps {
  titleRef: React.Ref<HTMLInputElement>;
  setTogglePostForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostForm: React.FC<PostFormProps> = ({ titleRef, setTogglePostForm }) => {
  const dispatch = useDispatch();
  const { addPostLoading } = useSelector((state: RootState) => state.post);
  const { me } = useSelector((state: RootState) => state.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  const navigator = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const postFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([postFormRef], () => {
    handleRemoveImages();
  });

  useTextareaAutoHeight(textareaRef, null);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );

  const handleHashtagsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHashtags(e.target.value);
    },
    [],
  );

  const handleClickFileUpload = useCallback(() => {
    imageInputRef.current!.click();
  }, []);

  const handleImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const urls = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...files]);
      setPreviewImages((prev) => [...prev, ...urls]);
      setActive(true);
    },
    [],
  );

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveImages = useCallback(() => {
    setSelectedImages([]);
    setPreviewImages([]);
    setTogglePostForm(false);
  }, [setTogglePostForm]);

  const handleAddPost = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!title || !title.trim() || !content || !content.trim()) {
        return alert("제목 또는 게시글을 작성하세요.");
      }
      const formData = new FormData();
      const contentWithBreaks = content.replace(/\n/g, "<br>");

      selectedImages.forEach((file) => {
        formData.append("image", file);
      });

      formData.append("title", title);
      formData.append("content", contentWithBreaks);
      formData.append("hashtags", hashtags);

      dispatch({ type: ADD_POST_REQUEST, data: formData });

      setActive(false);
      setSelectedImages([]);
      setPreviewImages([]);
      setTogglePostForm(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setContent("");
      setTitle("");
      setHashtags("");
      navigator("/");
    },
    [
      title,
      content,
      hashtags,
      selectedImages,
      dispatch,
      setTogglePostForm,
      navigator,
    ],
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <>
      {addPostLoading && <Spinner />}
      {me && (
        <S.FormContainer ref={postFormRef}>
          <S.CloseFormButton onClick={handleRemoveImages}>✖</S.CloseFormButton>
          <S.Title>새 글 작성</S.Title>
          <S.Form encType="multipart/form-data" onSubmit={handleAddPost}>
            <S.TitleInput
              value={title}
              placeholder="제목을 입력해 주세요"
              onChange={handleTitleChange}
              ref={titleRef}
            />
            <S.TextArea
              placeholder="당신의 생각을 들려주세요..."
              value={content}
              onChange={handleContentChange}
              ref={textareaRef}
            />
            <S.HashtagInput
              value={hashtags}
              placeholder="해시태그 (공백으로 구분)"
              onChange={handleHashtagsChange}
            />
            <input
              type="file"
              name="image"
              multiple
              hidden
              ref={imageInputRef}
              onChange={handleImagesChange}
            />

            <S.ImageWrapper>
              {active &&
                previewImages.map((url, index) => (
                  <S.ImageItem key={index}>
                    <S.Image src={url} alt="preview" />
                    <S.RemoveButton
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✖
                    </S.RemoveButton>
                  </S.ImageItem>
                ))}
            </S.ImageWrapper>

            <S.ButtonWrapper>
              <S.FileUploadButton type="button" onClick={handleClickFileUpload}>
                📎 이미지 추가
              </S.FileUploadButton>
              <S.SubmitButton type="submit">게시하기</S.SubmitButton>
            </S.ButtonWrapper>
          </S.Form>
        </S.FormContainer>
      )}
    </>
  );
};

export default PostForm;
