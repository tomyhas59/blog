import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import styled from "styled-components";
import FollowButton from "../../components/ui/FollowButton";
import { io, Socket } from "socket.io-client";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "./MyInfo";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarWrapper } from "../User";

const MyFollow: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);

  const socket = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const handleGoToUserPage = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  useEffect(() => {
    socket.current?.emit("followNotificationRead", me?.id);

    return () => {
      socket.current?.off("followNotificationRead");
    };
  }, [me, socket]);

  return (
    <FollowContainer>
      <FollowSection>
        <SectionHeading>팔로워 ({me?.Followers.length})</SectionHeading>
        <FollowList>
          {me?.Followers.map((follower) => {
            const isFollowing = me?.Followings.some(
              (f) => f.id === follower.id
            );

            return (
              <FollowItem key={follower.id}>
                <AvatarWrapper onClick={() => handleGoToUserPage(follower.id)}>
                  <Avatar
                    src={
                      follower?.Image
                        ? `${baseURL}/${follower?.Image?.src}`
                        : `${DEFAULT_PROFILE_IMAGE}`
                    }
                    alt={`${follower.nickname} 프로필 이미지`}
                  />
                  <>
                    {isFollowing ? (
                      <Nickname>{follower.nickname}</Nickname>
                    ) : (
                      <FollowButton userId={follower.id} />
                    )}
                  </>
                </AvatarWrapper>
              </FollowItem>
            );
          })}
        </FollowList>
      </FollowSection>
      <FollowSection>
        <SectionHeading>팔로잉 ({me?.Followings.length})</SectionHeading>
        <FollowList>
          {me?.Followings.map((following) => (
            <FollowItem key={following.id}>
              <AvatarWrapper>
                <Avatar
                  src={
                    following?.Image
                      ? `${baseURL}/${following?.Image?.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt={`${following.nickname} 프로필 이미지`}
                />
                <Nickname>
                  {following.nickname} <FollowButton userId={following.id} />
                </Nickname>
              </AvatarWrapper>
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
  flex-direction: column;
  padding: 5px;
  border-radius: 12px;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FollowSection = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const FollowList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const SectionHeading = styled.h2`
  font-size: 1.5em;
  color: #000;
  margin: 0;
  padding: 15px;
  color: ${(props) => props.theme.textColor};
  border-bottom: 2px solid ${(props) => props.theme.textColor};
  text-align: center;
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 1.3em;
  }
`;

const FollowItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-right: 1px solid #e0e0e0;
  position: relative;
  transition: background-color 0.3s ease;
  gap: 20px;

  @media (max-width: 768px) {
    width: 130px;
    padding: 5px;
  }
`;

const Nickname = styled.div`
  @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;
