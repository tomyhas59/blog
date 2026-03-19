import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { PostType, UserType } from "../../types";
import { baseURL } from "../../config";
import { RootState } from "../../reducer";
import FollowButton from "../../components/ui/FollowButton";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";

import * as S from "./UserPageStyles";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2023/04/12/01/47/cartoon-7918608_1280.png";

const UserPage = () => {
  const { userId } = useParams();
  const { me } = useSelector((state: RootState) => state.user);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollRefFollowings = useRef<HTMLDivElement>(null);
  const scrollRefFollowers = useRef<HTMLDivElement>(null);

  useHorizontalScroll(scrollRefFollowings);
  useHorizontalScroll(scrollRefFollowers);

  useEffect(() => {
    const getUserInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/user?userId=${userId}`);
          setUser(response.data);

          const responsePosts = await axios.get(`/post?userId=${userId}`);
          setPosts(responsePosts.data.posts);
          setHasMore(responsePosts.data.hasMore);
          setPage(2);
        } catch (error) {
          console.error("유저 정보 로드 실패:", error);
        }
      }
    };
    getUserInfo();
  }, [userId]);

  const fetchMorePosts = async () => {
    if (!userId || !hasMore) return;

    try {
      const response = await axios.get(
        `/post?userId=${userId}&page=${page}&limit=5`,
      );
      const newPosts = response.data.posts;

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("게시글 추가 로드 실패:", error);
    }
  };

  const goToUserPost = (postId: number) => {
    navigate(`/post/${postId}?page=1&sortBy=recent&cPage=1`);
  };

  const handleGoToUserPage = (targetId: number) => {
    navigate(`/user/${targetId}`);
  };

  if (!user) return null;

  return (
    <S.PageContainer>
      {/* 프로필 헤더 */}
      <S.ProfileHeader>
        <S.AvatarSection>
          <S.Avatar
            src={
              user?.Image ? `${baseURL}/${user?.Image?.src}` : DEFAULT_AVATAR
            }
            alt="Profile"
          />
        </S.AvatarSection>

        <S.ProfileInfo>
          <S.ProfileTop>
            <S.Nickname>{user.nickname}</S.Nickname>
            {me?.id !== user.id && (
              <S.FollowButtonWrapper>
                <FollowButton userId={user.id} />
              </S.FollowButtonWrapper>
            )}
          </S.ProfileTop>

          <S.StatsRow>
            <S.Stat>
              <S.StatNumber>{posts.length}</S.StatNumber>
              <S.StatLabel>게시물</S.StatLabel>
            </S.Stat>
            <S.Stat>
              <S.StatNumber>{user.Followers.length}</S.StatNumber>
              <S.StatLabel>팔로워</S.StatLabel>
            </S.Stat>
            <S.Stat>
              <S.StatNumber>{user.Followings.length}</S.StatNumber>
              <S.StatLabel>팔로잉</S.StatLabel>
            </S.Stat>
          </S.StatsRow>
        </S.ProfileInfo>
      </S.ProfileHeader>

      {/* 팔로잉 섹션 */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-user-friends"></i>
            팔로잉
          </S.SectionTitle>
          <S.SectionCount>{user.Followings.length}</S.SectionCount>
        </S.SectionHeader>

        <S.ScrollContainer ref={scrollRefFollowings}>
          {user.Followings.length > 0 ? (
            user.Followings.map((following) => (
              <S.UserCard
                key={following.id}
                onClick={() => handleGoToUserPage(following.id)}
              >
                <S.UserAvatar
                  src={
                    following?.Image
                      ? `${baseURL}/${following?.Image?.src}`
                      : DEFAULT_AVATAR
                  }
                  alt={following.nickname}
                />
                <S.UserName>{following.nickname.slice(0, 8)}</S.UserName>
              </S.UserCard>
            ))
          ) : (
            <S.EmptyMessage>팔로잉 중인 유저가 없습니다</S.EmptyMessage>
          )}
        </S.ScrollContainer>
      </S.Section>

      {/* 팔로워 섹션 */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-users"></i>
            팔로워
          </S.SectionTitle>
          <S.SectionCount>{user.Followers.length}</S.SectionCount>
        </S.SectionHeader>

        <S.ScrollContainer ref={scrollRefFollowers}>
          {user.Followers.length > 0 ? (
            user.Followers.map((follower) => (
              <S.UserCard
                key={follower.id}
                onClick={() => handleGoToUserPage(follower.id)}
              >
                <S.UserAvatar
                  src={
                    follower?.Image
                      ? `${baseURL}/${follower?.Image?.src}`
                      : DEFAULT_AVATAR
                  }
                  alt={follower.nickname}
                />
                <S.UserName>{follower.nickname.slice(0, 8)}</S.UserName>
              </S.UserCard>
            ))
          ) : (
            <S.EmptyMessage>팔로워가 없습니다</S.EmptyMessage>
          )}
        </S.ScrollContainer>
      </S.Section>

      {/* 게시글 섹션 */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-th"></i>
            게시물
          </S.SectionTitle>
          <S.SectionCount>{posts.length}</S.SectionCount>
        </S.SectionHeader>

        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={
            <S.LoadingMessage>
              <i className="fas fa-spinner fa-spin"></i>
              불러오는 중...
            </S.LoadingMessage>
          }
          endMessage={
            <S.EndMessage>
              <i className="fas fa-check-circle"></i>
              모든 게시물을 확인했습니다
            </S.EndMessage>
          }
          style={{ overflow: "visible" }}
        >
          {posts.length > 0 ? (
            <S.PostGrid>
              {posts.map((post) => (
                <S.PostCard key={post.id} onClick={() => goToUserPost(post.id)}>
                  {Array.isArray(post.Images) && post.Images[0]?.src ? (
                    <S.PostImage
                      src={`${baseURL}/${post.Images[0]?.src}`}
                      alt="Post"
                    />
                  ) : (
                    <S.NoImagePlaceholder>
                      <i className="far fa-image"></i>
                    </S.NoImagePlaceholder>
                  )}
                  <S.PostOverlay>
                    <S.PostTitle>{post.title}</S.PostTitle>
                    <S.PostStats>
                      <span>
                        <i className="far fa-heart"></i>
                        {post.Likers?.length || 0}
                      </span>
                      <span>
                        <i className="far fa-comment"></i>
                        {post.Comments?.length || 0}
                      </span>
                    </S.PostStats>
                  </S.PostOverlay>
                </S.PostCard>
              ))}
            </S.PostGrid>
          ) : (
            <S.EmptyMessage>작성한 게시물이 없습니다</S.EmptyMessage>
          )}
        </InfiniteScroll>
      </S.Section>
    </S.PageContainer>
  );
};

export default UserPage;
