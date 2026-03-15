import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import {
  DELETE_IMAGE_REQUEST,
  UPDATE_POST_REQUEST,
} from "../../../../reducer/post";
import { baseURL } from "../../../../config";
import { PostType } from "../../../../types";

import * as S from "./PostEditStyles";

interface PostEditFormProps {
  post: PostType;
  setEditPost: Dispatch<SetStateAction<boolean>>;
  toggleEditPostForm: () => void;
}

interface PreviewImage {
  src: string;
  isNew: boolean;
}

const PostEditForm = ({
  post,
  setEditPost,
  toggleEditPostForm,
}: PostEditFormProps) => {
  const prevTitle = post?.title;
  const prevContent = post?.content.replace(/<br\s*\/?>/gi, "\n");
  const prevHashtags = post?.Hashtags.map((tag) => tag.name).join(" ");
  const dispatch = useDispatch();

  const [title, setTitle] = useState(prevTitle);
  const [content, setContent] = useState(prevContent);
  const [hashtags, setHashtags] = useState(prevHashtags);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [removedOriginalImages, setRemovedOriginalImages] = useState<string[]>(
    [],
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const original = post.Images.map((img) => ({
      src: img.src,
      isNew: false,
    }));
    setPreviewImages(original);
  }, [post]);

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

  const handleImagesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreview = files.map((file) => ({
        src: URL.createObjectURL(file),
        isNew: true,
      }));
      setSelectedImages((prev) => [...prev, ...files]);
      setPreviewImages((prev) => [...prev, ...newPreview]);
    }
  }, []);

  const handleRemoveImage = useCallback(
    (index: number) => {
      const target = previewImages[index];
      if (!target.isNew) {
        setRemovedOriginalImages((prev) => [...prev, target.src]);
      } else {
        const selectedIndex = previewImages
          .filter((img) => img.isNew)
          .findIndex((img) => img.src === target.src);
        if (selectedIndex !== -1) {
          setSelectedImages((prev) =>
            prev.filter((_, i) => i !== selectedIndex),
          );
        }
      }
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    },
    [previewImages],
  );

  const handleEditPost = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const contentWithBreaks = content.replace(/\n/g, "<br>");

      removedOriginalImages.forEach((src) => {
        dispatch({
          type: DELETE_IMAGE_REQUEST,
          data: { postId: post.id, filename: src },
        });
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", contentWithBreaks);
      formData.append("postId", String(post.id));
      formData.append("hashtags", hashtags);
      selectedImages.forEach((file) => {
        formData.append("image", file);
      });

      dispatch({
        type: UPDATE_POST_REQUEST,
        data: formData,
      });
      setEditPost(false);
    },
    [
      content,
      dispatch,
      post.id,
      setEditPost,
      title,
      selectedImages,
      removedOriginalImages,
      hashtags,
    ],
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.isNew) URL.revokeObjectURL(img.src);
      });
    };
  }, [previewImages]);

  return (
    <S.EditForm encType="multipart/form-data" onSubmit={handleEditPost}>
      <S.EditTitleInput
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={handleTitleChange}
        ref={titleRef}
      />
      <S.EditTextArea
        placeholder="내용을 입력해주세요"
        value={content}
        onChange={handleContentChange}
      />
      <S.EditHashtagInput
        placeholder="해시태그 (공백으로 구분)"
        value={hashtags}
        onChange={handleHashtagsChange}
      />
      <S.EditImageWrapper>
        {previewImages.map((image, index) => (
          <S.EditImageItem key={index}>
            <S.EditImage
              src={image.isNew ? image.src : `${baseURL}/${image.src}`}
              alt={`preview-${index}`}
            />
            <S.EditRemoveButton
              type="button"
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </S.EditRemoveButton>
          </S.EditImageItem>
        ))}
      </S.EditImageWrapper>
      <S.EditButtonWrapper>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImagesChange}
        />
        <S.ActionButton type="button" onClick={handleClickFileUpload}>
          파일 추가
        </S.ActionButton>
        <S.ActionButton type="submit" variant="primary">
          수정 완료
        </S.ActionButton>
        <S.ActionButton type="button" onClick={toggleEditPostForm}>
          취소
        </S.ActionButton>
      </S.EditButtonWrapper>
    </S.EditForm>
  );
};

export default PostEditForm;
