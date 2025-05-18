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
import styled from "styled-components";
import { StyledButton } from "./Post";
import { FileUploadButton, TitleInput } from "./PostForm";
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
  const dispatch = useDispatch();

  const [title, setTitle] = useState(prevTitle);
  const [content, setContent] = useState(prevContent);

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
      <>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImagesChange}
        />
        <FileUploadButton type="button" onClick={handleClickFileUpload}>
          파일 첨부
        </FileUploadButton>
      </>
      <ImageContainer>
        {previewImages.map((image, index) => (
          <ImageItem key={index}>
            <EditImage
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
      </ImageContainer>

      <StyledButton style={{ width: "47px" }} type="submit">
        적용
      </StyledButton>
      <StyledButton style={{ width: "47px" }} onClick={toggleEditPostForm}>
        취소
      </StyledButton>
    </Form>
  );
};

export default PostEditForm;

const TextArea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ImageItem = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
  height: 200px;
  margin: 2px;
`;

const EditImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0px;
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;
