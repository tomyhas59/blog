import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ADD_POST_REQUEST } from "../../reducer/post";

import { RootState } from "../../reducer";
import Spinner from "../ui/Spinner";
import useTextareaAutoHeight from "../../hooks/useTextareaAutoHeight";

import { useNavigate } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";

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

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  const navigator = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  //OutsideClick----------------------------------------------
  const postFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([postFormRef], () => {
    handleRemoveImages();
  });

  //입력 시 textarea높이 조정
  useTextareaAutoHeight(textareaRef, null);

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
    []
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
        formData.append("image", file); //req.files
      });

      formData.append("title", title); //req.body.title
      formData.append("content", contentWithBreaks); //req.body.content

      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });

      setActive(false);
      setSelectedImages([]);
      setPreviewImages([]);
      setTogglePostForm(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setContent("");
      setTitle("");
      navigator("/");
    },

    [title, content, selectedImages, dispatch, setTogglePostForm, navigator]
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <>
      {addPostLoading ? <Spinner /> : null}
      {me ? (
        <FormContainer ref={postFormRef}>
          <CloseFormButton onClick={handleRemoveImages}>✖</CloseFormButton>
          <Title>글쓰기</Title>
          <Form encType="multipart/form-data" onSubmit={handleAddPost}>
            <TitleInput
              value={title}
              placeholder="제목을 입력해 주세요"
              onChange={handleTitleChange}
              ref={titleRef}
            />
            <TextArea
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={handleContentChange}
              ref={textareaRef}
            ></TextArea>
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
            <ImageContainer>
              {active &&
                previewImages.map((url, index) => (
                  <ImageItem key={index}>
                    <Image src={url} alt="preview" />
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✖
                    </RemoveButton>
                  </ImageItem>
                ))}
            </ImageContainer>
            <SubmitButton type="submit">등록</SubmitButton>
          </Form>
        </FormContainer>
      ) : null}
    </>
  );
};

export default PostForm;

const FormContainer = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 800px;
  margin: 0 auto;
  min-height: 220px;
  padding: 20px;
  border: 1px solid silver;
  border-radius: 10px;
  background-color: #f5f5f5;
  z-index: 200;
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const CloseFormButton = styled.button`
  position: absolute;
  top: 2%;
  right: 3%;
  font-size: 20px;
  &:hover {
    color: #ddd;
  }
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  width: 100%;
  display: grid;
  grid-template-areas:
    "a a"
    "b b"
    "c d"
    "e e";
  gap: 5px;
`;

export const TitleInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 2px solid #ccc;
  border-radius: 5px;
  grid-area: a;
`;

const TextArea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  min-height: 250px;
  max-height: 250px;

  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  grid-area: b;
`;

export const FileUploadButton = styled.button`
  padding: 6px;
  width: 100px;
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  grid-area: c;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 768px) {
    width: 70px;
    font-size: 12px;
    padding: 5px;
  }
`;

const ImageContainer = styled.div`
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  grid-area: e;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-height: 200px;
  }
`;

const ImageItem = styled.div`
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 8px;
  padding: 4px 7px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
  @media (max-width: 768px) {
    font-size: 8px;
    padding: 2px 5px;
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  grid-area: d;
  justify-self: end;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
