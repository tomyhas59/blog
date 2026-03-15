import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import { RootState } from "../../../reducer";
import FollowButton from "../../../components/ui/FollowButton";
import { baseURL } from "../../../config";

// 전용 스타일 임포트
import * as MS from "./MyFollowStyles";

// 외부 의존성 제거를 위해 내부 정의
const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2023/04/12/01/47/cartoon-7918608_1280.png";

const MyFollow: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const socket = useRef<Socket | null>(null);
  const navigate = useNavigate();

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
    if (me?.id) {
      socket.current?.emit("followNotificationRead", me.id);
    }
  }, [me]);

  return (
    <MS.FollowContainer>
      {/* 팔로워 섹션 */}
      <MS.FollowSection>
        <MS.SectionHeader>
          팔로워 <span>{me?.Followers.length || 0}</span>
        </MS.SectionHeader>
        <MS.FollowGrid>
          {me?.Followers.map((follower) => (
            <MS.UserCard key={follower.id}>
              <MS.UserInfo onClick={() => navigate(`/user/${follower.id}`)}>
                <MS.InternalAvatar
                  src={
                    follower?.Image
                      ? `${baseURL}/${follower?.Image?.src}`
                      : DEFAULT_PROFILE_IMAGE
                  }
                  alt={follower.nickname}
                />
                <MS.Nickname>{follower.nickname}</MS.Nickname>
              </MS.UserInfo>
              {/* 내가 팔로우하지 않은 사람만 팔로우 버튼 표시 (맞팔 유도) */}
              {!me?.Followings.some((f) => f.id === follower.id) && (
                <FollowButton userId={follower.id} />
              )}
            </MS.UserCard>
          ))}
        </MS.FollowGrid>
      </MS.FollowSection>

      {/* 팔로잉 섹션 */}
      <MS.FollowSection>
        <MS.SectionHeader>
          팔로잉 <span>{me?.Followings.length || 0}</span>
        </MS.SectionHeader>
        <MS.FollowGrid>
          {me?.Followings.map((following) => (
            <MS.UserCard key={following.id}>
              <MS.UserInfo onClick={() => navigate(`/user/${following.id}`)}>
                <MS.InternalAvatar
                  src={
                    following?.Image
                      ? `${baseURL}/${following?.Image?.src}`
                      : DEFAULT_PROFILE_IMAGE
                  }
                  alt={following.nickname}
                />
                <MS.Nickname>{following.nickname}</MS.Nickname>
              </MS.UserInfo>
              <FollowButton userId={following.id} />
            </MS.UserCard>
          ))}
        </MS.FollowGrid>
      </MS.FollowSection>
    </MS.FollowContainer>
  );
};

export default MyFollow;
