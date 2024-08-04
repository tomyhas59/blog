import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import styled from "styled-components";
import useOutsideClick from "../../hooks/useOutsideClick";
import FollowButton from "../../components/FollowButton";

const MyFollow: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const [activeUserOption, setActiveUserOption] = useState<string | null>(null);

  const onUserOptionClick = useCallback((nickname: string) => {
    setActiveUserOption((prev) => (prev === nickname ? null : nickname));
  }, []);

  const userOptionRef = useRef<HTMLDivElement>(null);

  useOutsideClick([userOptionRef], () => {
    setActiveUserOption(null);
  });

  return (
    <FollowContainer>
      <FollowList>
        <Heading>팔로워 {me?.Followers.length}명</Heading>
        {me?.Followers.map((follower) => (
          <FollowItem key={follower.id}>
            <Nickname>{follower.nickname}</Nickname>
          </FollowItem>
        ))}
      </FollowList>
      <FollowList>
        <Heading>팔로잉 {me?.Followings.length}명</Heading>
        {me?.Followings.map((following) => (
          <FollowItem
            key={following.id}
            onClick={() => onUserOptionClick(following.nickname)}
          >
            <Nickname>{following.nickname}</Nickname>
            {activeUserOption === following.nickname && (
              <UserOption ref={userOptionRef}>
                <FollowButton
                  userId={following.id}
                  setActiveUserOption={setActiveUserOption}
                />
              </UserOption>
            )}
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
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FollowList = styled.div`
  position: relative;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 481px) {
    width: 300px;
  }
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
    margin-bottom: 12px;
  }
`;

const FollowItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  position: relative;
  cursor: pointer;
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

const UserOption = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 100px;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #fff;

  & button {
    margin: 5px 0;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }

  @media (max-width: 480px) {
    z-index: 999;
    width: 80px;
    top: 30px;
    left: 50px;
    padding: 2px;
    font-size: 10px;
  }
`;
