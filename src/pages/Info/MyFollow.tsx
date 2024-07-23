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
        {me?.Followers.map((follower) => (
          <FollowItem key={follower.id}>
            <Nickname>{follower.nickname}</Nickname>
          </FollowItem>
        ))}
      </FollowList>
      <FollowList>
        <Heading>팔로잉</Heading>
        {me?.Followings.map((following) => (
          <FollowItem key={following.id}>
            <Nickname>{following.nickname}</Nickname>
          </FollowItem>
        ))}
      </FollowList>
    </FollowContainer>
  );
};

export default MyFollow;

const FollowContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FollowList = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.mainColor};
  margin-bottom: 16px;
  border-bottom: 2px solid ${(props) => props.theme.mainColor};
  padding-bottom: 8px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const FollowItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Nickname = styled.span`
  font-size: 18px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;
