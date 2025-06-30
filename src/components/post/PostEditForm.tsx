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
import { StyledButton } from "./Post";
import {
  ButtonWrapper,
  Form,
  ImageItem,
  Image,
  ImageWrapper,
  RemoveButton,
  TextArea,
  TitleInput,
  HashtagInput,
} from "./PostForm";
import { useDispatch } from "react-redux";
import { DELETE_IMAGE_REQUEST, UPDATE_POST_REQUEST } from "../../reducer/post";

import { baseURL } from "../../config";
import { PostType } from "../../types";

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
  const handleClickFileUpload = useCallback(() => {
    imageInputRef.current!.click();
  }, []);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const [selectedImages, setSelectedImages] = useState<File[]>([]); // 새로 선택한 이미지
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [removedOriginalImages, setRemovedOriginalImages] = useState<string[]>(
    []
  ); // 삭제된 기존 이미지

  // 초기 이미지 세팅
  useEffect(() => {
    const original = post.Images.map((img) => ({
      src: img.src,
      isNew: false,
    }));
    setPreviewImages(original);
  }, [post]);

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [setTitle]
  );

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const handleHashtagsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      console.log("hashtags input changed:", e.target.value);
      setHashtags(e.target.value);
    },
    [setHashtags]
  );

  // 이미지 추가
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

  // 이미지 삭제
  const handleRemoveImage = useCallback(
    (index: number) => {
      const target = previewImages[index];

      if (!target.isNew) {
        // 기존 이미지면 삭제 목록에 추가
        setRemovedOriginalImages((prev) => [...prev, target.src]);
      } else {
        // 새 이미지면 selectedImages에서도 제거
        const selectedIndex = previewImages
          .filter((img) => img.isNew)
          .findIndex((img) => img.src === target.src);

        if (selectedIndex !== -1) {
          setSelectedImages((prev) =>
            prev.filter((_, i) => i !== selectedIndex)
          );
        }
      }

      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    },
    [previewImages]
  );

  const handleEditPost = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const contentWithBreaks = content.replace(/\n/g, "<br>");

      // 삭제된 기존 이미지 제거 요청
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
      // 새로 추가된 이미지 파일들
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
    ]
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.isNew) {
          URL.revokeObjectURL(img.src);
        }
      });
    };
  }, [previewImages]);

  return (
    <Form encType="multipart/form-data" onSubmit={(e) => handleEditPost(e)}>
      <TitleInput
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={handleTitleChange}
        ref={titleRef}
      />
      <TextArea
        placeholder="내용을 입력해주세요"
        value={content}
        onChange={handleContentChange}
      />
      <HashtagInput
        placeholder="해시태그를 공백으로 구분(예: 딸기 바나나)"
        value={hashtags}
        onChange={handleHashtagsChange}
      />
      <ImageWrapper>
        {previewImages.map((image, index) => (
          <ImageItem key={index}>
            <Image
              src={image.isNew ? image.src : `${baseURL}/${image.src}`}
              alt={`preview-${index}`}
            />
            <RemoveButton
              type="button"
              onClick={() => handleRemoveImage(index)}
            >
              x
            </RemoveButton>
          </ImageItem>
        ))}
      </ImageWrapper>
      <ButtonWrapper>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImagesChange}
        />
        <StyledButton type="button" onClick={handleClickFileUpload}>
          파일 첨부
        </StyledButton>
        <StyledButton style={{ width: "47px" }} type="submit">
          적용
        </StyledButton>
        <StyledButton style={{ width: "47px" }} onClick={toggleEditPostForm}>
          취소
        </StyledButton>
      </ButtonWrapper>
    </Form>
  );
};

export default PostEditForm;
