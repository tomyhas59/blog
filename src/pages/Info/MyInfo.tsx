import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import moment from "moment";
import styled from "styled-components";
const MyInfo: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);

  if (!me) {
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const createdAt = me.createdAt;
  const profileImageUrl = "";

  const createdAtDate = moment(createdAt);
  const formattedDate = createdAtDate.format("l");

  return (
    <InfoContainer>
      <ProfileSection>
        {profileImageUrl ? (
          <ProfileImage
            src={profileImageUrl}
            alt={`${me.nickname}의 프로필 사진`}
          />
        ) : (
          <DefaultProfileEmoji>👤</DefaultProfileEmoji>
        )}

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

const DefaultProfileEmoji = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  margin-right: 20px;
`;
