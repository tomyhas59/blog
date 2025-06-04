import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { UserType } from "../../types";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../Info/MyInfo";

const UserPage = () => {
  const { userId } = useParams();

  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/user?userId=${userId}`);

          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserInfo();
  }, [userId]);

  if (!user) return null;

  console.log(user);

  return (
    <Container>
      프로필 정보
      <ProfileHeader>
        <Avatar
          src={
            user?.Image
              ? `${baseURL}/${user?.Image?.src}`
              : `${DEFAULT_PROFILE_IMAGE}`
          }
          alt={`${user.nickname} 프로필 이미지`}
        />
        <UserInfo>
          <Username>{user.nickname}</Username>
          <FollowStats>
            <Stats>{user.Followings.length} 팔로잉</Stats>
            <Stats>{user.Followers.length} 팔로워</Stats>
          </FollowStats>
        </UserInfo>
      </ProfileHeader>
      {/* 팔로잉 & 팔로워 목록 */}
      <section>
        <SectionTitle>팔로잉</SectionTitle>
        <FollowList>
          {user.Followings.map((following) => (
            <FollowBadge key={following.id}>{following.nickname}</FollowBadge>
          ))}
        </FollowList>

        <SectionTitle>팔로워</SectionTitle>
        <FollowList>
          {user.Followers.map((follower) => (
            <FollowBadge key={follower.id}>{follower.nickname}</FollowBadge>
          ))}
        </FollowList>
      </section>
      <section>
        <SectionTitle>게시글</SectionTitle>
        <PostGrid>
          {user.Posts?.map((post) => (
            <PostCard key={post.id}>
              {post.Images[0]?.src && (
                <PostImage
                  src={`${baseURL}/${post.Images[0]?.src}`}
                  alt="게시글 이미지"
                />
              )}
              <PostContent>
                <PostTitle>{post.title}</PostTitle>
              </PostContent>
            </PostCard>
          ))}
        </PostGrid>
      </section>
    </Container>
  );
};

export default UserPage;

const Container = styled.section`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  padding: 30px;
  max-width: 400px;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

const ProfileHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid ${(props) => props.theme.mainColor};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.h1`
  color: ${(props) => props.theme.charColor};
  font-size: 20px;
`;

const FollowStats = styled.div`
  display: flex;
  gap: 10px;
  font-size: 14px;
`;

const Stats = styled.span`
  font-weight: bold;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.mainColor};
`;

const FollowList = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const FollowBadge = styled.span`
  background-color: ${(props) => props.theme.subColor};
  color: ${(props) => props.theme.textColor};
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hoverSubColor};
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PostCard = styled.article`
  background-color: ${(props) => props.theme.backgroundColor || "#fff"};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PostImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 15px;
`;

const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${(props) => props.theme.charColor};
`;
