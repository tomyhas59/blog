import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import { RootState } from "../../../reducer";
import FollowButton from "../../../components/ui/FollowButton";
import { baseURL } from "../../../config";

import * as S from "./MyFollowStyles";

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
    <S.Container>
      {/* 팔로워 섹션 */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-users"></i>
            팔로워
          </S.SectionTitle>
          <S.Count>{me?.Followers.length || 0}</S.Count>
        </S.SectionHeader>

        {me?.Followers.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <i className="far fa-user"></i>
            </S.EmptyIcon>
            <S.EmptyText>팔로워가 없습니다</S.EmptyText>
          </S.EmptyState>
        ) : (
          <S.UserGrid>
            {me?.Followers.map((follower) => (
              <S.UserCard key={follower.id}>
                <S.UserInfo onClick={() => navigate(`/user/${follower.id}`)}>
                  <S.Avatar
                    src={
                      follower?.Image
                        ? `${baseURL}/${follower?.Image?.src}`
                        : DEFAULT_PROFILE_IMAGE
                    }
                    alt={follower.nickname}
                  />
                  <S.Nickname>{follower.nickname}</S.Nickname>
                </S.UserInfo>
                {!me?.Followings.some((f) => f.id === follower.id) && (
                  <S.ButtonWrapper>
                    <FollowButton userId={follower.id} />
                  </S.ButtonWrapper>
                )}
              </S.UserCard>
            ))}
          </S.UserGrid>
        )}
      </S.Section>

      {/* 팔로잉 섹션 */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-user-friends"></i>
            팔로잉
          </S.SectionTitle>
          <S.Count>{me?.Followings.length || 0}</S.Count>
        </S.SectionHeader>

        {me?.Followings.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <i className="far fa-user"></i>
            </S.EmptyIcon>
            <S.EmptyText>팔로잉 중인 유저가 없습니다</S.EmptyText>
          </S.EmptyState>
        ) : (
          <S.UserGrid>
            {me?.Followings.map((following) => (
              <S.UserCard key={following.id}>
                <S.UserInfo onClick={() => navigate(`/user/${following.id}`)}>
                  <S.Avatar
                    src={
                      following?.Image
                        ? `${baseURL}/${following?.Image?.src}`
                        : DEFAULT_PROFILE_IMAGE
                    }
                    alt={following.nickname}
                  />
                  <S.Nickname>{following.nickname}</S.Nickname>
                </S.UserInfo>
                <S.ButtonWrapper>
                  <FollowButton userId={following.id} />
                </S.ButtonWrapper>
              </S.UserCard>
            ))}
          </S.UserGrid>
        )}
      </S.Section>
    </S.Container>
  );
};

export default MyFollow;
