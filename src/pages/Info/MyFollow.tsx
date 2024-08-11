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
      <FollowSection>
        <SectionHeading>팔로워 ({me?.Followers.length})</SectionHeading>
        <FollowList>
          {me?.Followers.map((follower) => (
            <FollowItem
              key={follower.id}
              onClick={() => onUserOptionClick(follower.nickname)}
            >
              <Nickname>{follower.nickname}</Nickname>
              {activeUserOption === follower.nickname && (
                <UserOption ref={userOptionRef}>
                  <FollowButton
                    userId={follower.id}
                    setActiveUserOption={setActiveUserOption}
                  />
                </UserOption>
              )}
            </FollowItem>
          ))}
        </FollowList>
      </FollowSection>
      <FollowSection>
        <SectionHeading>팔로잉 ({me?.Followings.length})</SectionHeading>
        <FollowList>
          {me?.Followings.map((following) => (
            <FollowItem key={following.id}>
              <Nickname>{following.nickname}</Nickname>
            </FollowItem>
          ))}
        </FollowList>
      </FollowSection>
    </FollowContainer>
  );
};

export default MyFollow;

const FollowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FollowSection = styled.div`
  flex: 1;
  min-width: 280px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FollowList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: #fff;
`;

const SectionHeading = styled.h2`
  font-size: 1.5em;
  color: ${(props) => props.theme.mainColor};
  margin: 0;
  padding: 15px;
  background-color: ${(props) => props.theme.lightBg};
  border-bottom: 2px solid ${(props) => props.theme.mainColor};
  text-align: center;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.3em;
  }
`;

const FollowItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Nickname = styled.span`
  font-size: 1em;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

const UserOption = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
  font-size: 0.9em;
  z-index: 1000;
  padding: 5px;
  display: flex;
  align-items: center;

  & button {
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: scale(1.1);
      color: ${(props) => props.theme.charColor};
    }
  }

  @media (max-width: 768px) {
    width: 70px;
  }
`;
