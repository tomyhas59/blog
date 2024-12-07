import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import { baseURL } from "../../config";
import { useDispatch } from "react-redux";
import Spinner from "../../components/Spinner";

export const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2023/04/12/01/47/cartoon-7918608_1280.png";

const MyInfo: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const imageInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>(me?.Image?.src || "");
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get("/user/profileImage");
        setImageSrc(response.data);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [imageSrc]);

  if (!me) {
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const createdAt = me.createdAt;
  const createdAtDate = moment(createdAt);
  const formattedDate = createdAtDate.format("l");

  const onClickFileUpload = () => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  };

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onCancel = () => {
    setFile(null);
    setPreviewUrl("");
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  const onRemoveImage = async () => {
    const confirmRemoval = window.confirm("정말 제거하시겠습니까?");
    if (!confirmRemoval) {
      return;
    }
    try {
      await axios.delete("/user/profileImage");
      setImageSrc(DEFAULT_PROFILE_IMAGE);
      dispatch({
        type: "DELETE_USER_IMAGE",
        data: null,
      });
      alert("프로필 사진이 제거되었습니다.");
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !me) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setIsLoading(true);
      const response = await axios.post("/user/profileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImageUrl = response.data.src;

      dispatch({
        type: "SET_USER_IMAGE",
        data: { src: newImageUrl },
      });

      setImageSrc(newImageUrl);
      setFile(null);
      setPreviewUrl("");
      alert("등록되었습니다.");
      setIsLoading(false);
      if (imageInput.current) {
        imageInput.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <InfoContainer>
        <ProfileSection>
          <form encType="multipart/form-data" onSubmit={onSubmit}>
            {imageSrc && !file && (
              <RemoveButton type="button" onClick={onRemoveImage}>
                ✖
              </RemoveButton>
            )}
            <ProfileImage
              onClick={onClickFileUpload}
              src={
                previewUrl ||
                (imageSrc ? `${baseURL}/${imageSrc}` : DEFAULT_PROFILE_IMAGE)
              }
              alt="userImage"
            />
            <input
              type="file"
              name="image"
              hidden
              ref={imageInput}
              onChange={onChangeImages}
            />
            {file && (
              <ButtonContainer>
                <SubmitButton type="submit">등록</SubmitButton>
                <CancelButton type="button" onClick={onCancel}>
                  취소
                </CancelButton>
              </ButtonContainer>
            )}
          </form>
          <InfoText>
            <h1>내 정보</h1>
            <UserInfo>
              <strong>사용자명:</strong> {me.nickname}
            </UserInfo>
            <UserInfo>
              <strong>이메일:</strong> {me.email}
            </UserInfo>
            <UserInfo>
              <strong>가입일:</strong> {formattedDate}
            </UserInfo>
          </InfoText>
        </ProfileSection>
      </InfoContainer>
    </>
  );
};

export default MyInfo;

const InfoContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 15px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > form {
    position: relative;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #cccccc;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: block;
  margin: 0 auto;

  &:hover {
    transform: scale(1.1);
    border-color: #888888;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  > h1 {
    font-size: 1.5em;
    font-weight: bold;
    color: #333333;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    > h1 {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
  }
`;

const UserInfo = styled.p`
  font-size: 1em;
  color: #666666;
  margin: 5px 0;

  > strong {
    font-weight: 600;
    color: #444444;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: ${(props) => props.theme.subColor};
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9em;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9em;
  }
`;
const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  color: #888888;
  border: none;
  line-height: 100%;
  text-align: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
    font-weight: bold;
  }
  @media (max-width: 480px) {
    width: 15px;
    height: 15px;
    font-size: 1em;
  }
`;
