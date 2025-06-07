import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { UserType } from "../../types";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../Info/MyInfo";
import FollowButton from "../../components/ui/FollowButton";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import UserPageButton from "../../components/ui/UserPageButton";
import useScroll from "../../hooks/useScroll";

const UserPage = () => {
  const { userId } = useParams();
  const { me } = useSelector((state: RootState) => state.user);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

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

  const scrollRefFollowings = useRef<HTMLDivElement>(null);
  const scrollRefFollowers = useRef<HTMLDivElement>(null);

  useScroll(scrollRefFollowings);
  useScroll(scrollRefFollowers);

  const goToUserPost = (postId: number) => {
    navigate(`/post/${postId}?page=1&sortBy=recent&cPage=1`);
  };

  if (!user) return null;

  console.log(user);

  return (
    <Container>
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
        {me?.id === user.id ? null : (
          <>
            <FollowButton userId={user.id} />
          </>
        )}
      </ProfileHeader>
      <section>
        <SectionTitle>팔로잉</SectionTitle>
        <FollowList ref={scrollRefFollowings}>
          {user.Followings.length > 0 ? (
            user.Followings.map((following) => (
              <AvatarWrapper key={following.id}>
                <FollowAvatar
                  src={
                    following?.Image
                      ? `${baseURL}/${following?.Image?.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt={`${following.nickname} 프로필 이미지`}
                />
                <UserPageButton
                  userId={following.id}
                  content={following.nickname}
                />
              </AvatarWrapper>
            ))
          ) : (
            <div>아직 팔로잉 중인 사람이 없습니다.</div>
          )}
        </FollowList>
        <SectionTitle>팔로워</SectionTitle>
        <FollowList ref={scrollRefFollowers}>
          {user.Followers.length > 0 ? (
            user.Followers.map((follower) => (
              <AvatarWrapper key={follower.id}>
                <FollowAvatar
                  src={
                    follower?.Image
                      ? `${baseURL}/${follower?.Image?.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt={`${follower.nickname} 프로필 이미지`}
                />
                <UserPageButton
                  userId={follower.id}
                  content={follower.nickname}
                />
              </AvatarWrapper>
            ))
          ) : (
            <div>팔로워가 없습니다.</div>
          )}
        </FollowList>
      </section>
      <section>
        <SectionTitle>게시글</SectionTitle>
        <PostGrid>
          {user.Posts?.map((post) => (
            <PostCard key={post.id} onClick={() => goToUserPost(post.id)}>
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
  max-width: 800px;
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

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  button {
    padding: 2px 5px;
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid ${(props) => props.theme.mainColor};
`;

const FollowAvatar = styled(Avatar)`
  width: 50px;
  height: 50px;
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
  width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.subColor};
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
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
  }
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
