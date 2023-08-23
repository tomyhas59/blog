import React, { useCallback } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_POST_REQUEST,
  REMOVE_IMAGE_REQUEST,
  UPLOAD_IMAGES_REQUEST,
} from "../reducer/post";
import { useEffect } from "react";
const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostDone, addPostError } = useSelector(
    (state) => state.post
  );
  const { me } = useSelector((state) => state.user);
  const [content, contentOnChane, setContent] = useInput();

  useEffect(() => {
    if (addPostError) {
      console.log(addPostError);
    }
    if (addPostDone) {
      setContent("");
    }
  }, [addPostDone, addPostError, setContent]);

  const onChangeImages = useCallback(
    (e) => {
      console.log("images", e.target.files);
      const imageFormData = new FormData();

      // 중복된 이미지 파일명을 방지하기 위해 Set 사용
      const addedImageNames = new Set();
      
      [].forEach.call(e.target.files /*선택한 파일들 */, (f) => {
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

  const onRemoveImage = useCallback(
    (filename) => () => {
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
    (e) => {
      e.preventDefault();
      if (!content || !content.trim()) {
        //trim 공백 제거
        return alert("게시글을 작성하세요.");
      }
      const formData = new FormData();
      imagePaths.forEach((p) => {
        formData.append("image", p); //req.body.image
      });
      formData.append("content", content);
      return dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    },
    [content, imagePaths, dispatch]
  );

  const Enter = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <>
      {me ? (
        <FormWrapper>
          <Title>글쓰기</Title>
          <Form encType="multipart/form-data" onSubmit={onSubmit}>
            <TextArea
              placeholder="Content"
              value={content}
              onChange={contentOnChane}
              onKeyUp={Enter}
            ></TextArea>
            <div>
              <input
                type="file"
                name="image"
                multiple
                onChange={onChangeImages}
              />
            </div>
            <ImgWrapper>
              {imagePaths.map((v) => (
                <div key={v}>
                  <Img src={`http://localhost:3075/${v}`} alt="img" />
                  <Button type="button" onClick={onRemoveImage(v)}>
                    제거
                  </Button>
                </div>
              ))}
            </ImgWrapper>
            <br />
            <Button type="submit">등록</Button>
          </Form>
        </FormWrapper>
      ) : null}
    </>
  );
};

export default PostForm;

const FormWrapper = styled.div`
  max-width: 800px;
  border: 1px solid;
  border-color: silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;
const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
const Img = styled.img`
  width: 300px;
  height: 200px;
`;

const ImgWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    3,
    1fr
  ); /* n개의 열로 정렬, 1fr 동등한 비율로 크기 결정 */
  gap: 20px; /* 이미지와 버튼 간의 간격 조절 */
`;
