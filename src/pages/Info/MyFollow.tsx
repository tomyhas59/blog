import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";

import styled from "styled-components";

const MyFollow: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);

  return (
    <FollowContainer>
      <FollowList>
        <Heading>팔로워</Heading>
      </FollowList>
      <FollowList>
        <Heading>팔로잉</Heading>
        {me?.Followings.map((following) => following.nickname)}
      </FollowList>
    </FollowContainer>
  );
};

export default MyFollow;

const FollowContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FollowList = styled.div`
  margin-bottom: 20px;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;
