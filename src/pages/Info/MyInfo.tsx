import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import { baseURL } from "../../config";

const MyInfo: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const imageInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>(me?.Image?.src || "");

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !me) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post("/user/profileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      const newImageUrl = response.data.src;
      setImageSrc(newImageUrl);
      setFile(null);
      setPreviewUrl("");
      if (imageInput.current) {
        imageInput.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <InfoContainer>
      <ProfileSection>
        <form encType="multipart/form-data" onSubmit={onSubmit}>
          <ProfileImage
            onClick={onClickFileUpload}
            src={previewUrl || `${baseURL}/${imageSrc}`}
            alt={`${me.nickname}의 프로필 사진`}
          />
          <input
            type="file"
            name="image"
            hidden
            ref={imageInput}
            onChange={onChangeImages}
          />
          <button type="submit">등록</button>
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
  );
};

export default MyInfo;

const InfoContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
  cursor: pointer; // Show cursor as pointer to indicate that image is clickable
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  > h1 {
    font-weight: bold;
  }
`;

const UserInfo = styled.p`
  margin: 10px 0;
`;
