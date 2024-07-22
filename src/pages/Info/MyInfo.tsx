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

  const createdAtDate = moment(createdAt);
  const formattedDate = createdAtDate.format("l");

  return (
    <InfoContainer>
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
  h1 {
    font-weight: bold;
  }
`;

const UserInfo = styled.p`
  margin: 10px 0;
`;
