import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_POST_REQUEST,
  REMOVE_IMAGE_REQUEST,
  UPLOAD_IMAGES_REQUEST,
} from "../reducer/post";
import { useEffect } from "react";
import { RootState } from "../reducer";

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostDone, addPostError } = useSelector(
    (state: RootState) => state.post
  );
  const { me } = useSelector((state: RootState) => state.user);
  const [content, setContent] = useState("");

  const contentOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const imageInput = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (addPostError) {
      console.log(addPostError);
    }
    if (addPostDone) {
      setContent("");
    }
  }, [addPostDone, addPostError, setContent]);

  const onClickFileUpload = useCallback(() => {
    imageInput.current!.click();
  }, []);

  const onChangeImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("images", e.target.files);
      const imageFormData = new FormData();

      // 중복된 이미지 파일명을 방지하기 위해 Set 사용
      const addedImageNames = new Set();

      const filse = e.target.files as FileList;

      [].forEach.call(filse /*선택한 파일들 */, (f: File) => {
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
      setActive(true);
    },

    [dispatch]
  );

  const onRemoveImage = useCallback(
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

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!content || !content.trim()) {
        //trim 공백 제거
        return alert("게시글을 작성하세요.");
      }
      const formData = new FormData();
      imagePaths.forEach((p) => {
        formData.append("image", p); //req.body.image
      });
      formData.append("content", content); //req.body.content

      setActive(false);
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    },
    [content, imagePaths, dispatch]
  );

  return (
    <>
      {me ? (
        <FormWrapper>
          <Title>글쓰기</Title>
          <Form encType="multipart/form-data" onSubmit={onSubmit}>
            <TextArea
              placeholder="Content"
              value={content}
              onChange={contentOnChange}
            ></TextArea>
            <input
              type="file"
              name="image"
              multiple
              hidden
              ref={imageInput}
              onChange={onChangeImages}
            />
            <FileButton onClick={onClickFileUpload}>파일 첨부</FileButton>
            <ImageGrid>
              {active &&
                imagePaths.map((filename, index) => (
                  <ImageContainer key={index}>
                    <Image
                      src={`http://localhost:3075/${filename}`}
                      alt="img"
                    />
                    <RemoveButton
                      type="button"
                      onClick={onRemoveImage(filename)}
                    >
                      x
                    </RemoveButton>
                  </ImageContainer>
                ))}
            </ImageGrid>

            <SubmitButton type="submit">등록</SubmitButton>
          </Form>
        </FormWrapper>
      ) : null}
    </>
  );
};

export default PostForm;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 10px auto;
  min-height: 220px;
  padding: 20px;
  border: 1px solid silver;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 10px 10px 10px rgba(144, 238, 144, 0.5);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  width: 100%;
  text-align: center;
`;

export const TextArea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const FileButton = styled.div`
  display: block;
  padding: 10px;
  width: 100px;
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.theme.subColor};
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
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

export const SubmitButton = styled.button`
  padding: 12px;
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.theme.subColor};
  }
`;
