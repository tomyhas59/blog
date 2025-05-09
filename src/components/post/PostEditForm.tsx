import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useRef,
} from "react";
import styled from "styled-components";
import { Button } from "./Post";
import { FileUploadButton } from "./PostForm";
import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_IMAGE_REQUEST,
  REMOVE_IMAGE_REQUEST,
  UPDATE_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
} from "../../reducer/post";

import { baseURL } from "../../config";
import { RootState } from "../../reducer";
import { PostType } from "../../types";

interface PostEditFormProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  post: PostType;
  setEditPost: Dispatch<SetStateAction<boolean>>;
  toggleEditPostForm: () => void;
}

const PostEditForm = ({
  content,
  setContent,
  post,
  setEditPost,
  toggleEditPostForm,
}: PostEditFormProps) => {
  const { imagePaths } = useSelector((state: RootState) => state.post);

  const prevContent = content.replace(/<br\s*\/?>/gi, "\n");
  const dispatch = useDispatch();

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const handleRemoveImage = useCallback(
    (filename: string) => () => {
      if (filename) {
        dispatch({
          type: REMOVE_IMAGE_REQUEST,
          data: filename,
        });
      }
    },
    [dispatch]
  );

  const handleDeleteImage = useCallback(
    (filename: string) => () => {
      if (filename) {
        dispatch({
          type: DELETE_IMAGE_REQUEST,
          data: {
            postId: post.id,
            filename,
          },
        });
      }
    },
    [dispatch, post.id]
  );

  const handleClickFileUpload = useCallback(() => {
    imageInputRef.current!.click();
  }, []);

  const handleImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("images", e.target.files);

      const imageFormData = new FormData();
      // 중복된 이미지 파일명을 방지하기 위해 Set 사용
      const addedImageNames = new Set();

      const files = e.target.files as FileList;
      [].forEach.call(files /*선택한 파일들 */, (f: File) => {
        // 이미 추가된 이미지인지 확인하고 추가되지 않은 경우에만 처리
        if (!addedImageNames.has(f.name)) {
          addedImageNames.add(f.name);
          imageFormData.append("image" /*키값 */, f);
        }
      });

      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    },

    [dispatch]
  );

  const handleEditPost = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          postId: post.id,
          content: contentWithBreaks,
          imagePaths: imagePaths,
        },
      });

      setEditPost(false);
    },
    [content, dispatch, imagePaths, post.id, setEditPost]
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const editPostRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <Form encType="multipart/form-data" onSubmit={(e) => handleEditPost(e)}>
        <TextArea
          placeholder="입력해주세요"
          value={prevContent}
          onChange={handleContentChange}
          ref={editPostRef}
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
          {/**기존 이미지 */}
          {post.Images?.map((image) => (
            <ImageItem key={image.id}>
              <EditImage src={`${baseURL}/${image.src}`} alt={image.src} />
              <RemoveButton
                type="button"
                onClick={handleDeleteImage(image.src)}
              >
                x
              </RemoveButton>
            </ImageItem>
          ))}
          {/**파일 첨부 시 이미지 */}
          {imagePaths.map((filename, index) => (
            <ImageItem key={index}>
              <EditImage src={`${baseURL}/${filename}`} alt="img" />
              <RemoveButton type="button" onClick={handleRemoveImage(filename)}>
                x
              </RemoveButton>
            </ImageItem>
          ))}
        </ImageContainer>
        <Button type="submit">적용</Button>
        <Button onClick={toggleEditPostForm}>취소</Button>
      </Form>
    </div>
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
