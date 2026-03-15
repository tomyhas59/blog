import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { PostType, UserType } from "../../types";
import { baseURL } from "../../config";
import { RootState } from "../../reducer";
import FollowButton from "../../components/ui/FollowButton";
import UserPageButton from "../../components/ui/UserPageButton";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";

// 새롭게 만든 전용 스타일 임포트
import * as S from "./UserPageStyles";

// 기본 프로필 이미지 내부 정의 (Info 도메인 의존성 제거)
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

          // 게시글 첫 페이지 로드
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
      <S.ProfileSection>
        <S.MainAvatar
          src={user?.Image ? `${baseURL}/${user?.Image?.src}` : DEFAULT_AVATAR}
          alt="Profile"
        />
        <S.UserDetail>
          <S.NicknameTitle>{user.nickname}</S.NicknameTitle>
          <S.CountRow>
            <p>
              팔로잉 <span>{user.Followings.length}</span>
            </p>
            <p>
              팔로워 <span>{user.Followers.length}</span>
            </p>
          </S.CountRow>
        </S.UserDetail>
        {me?.id !== user.id && <FollowButton userId={user.id} />}
      </S.ProfileSection>

      <section>
        <S.SectionLabel>팔로잉</S.SectionLabel>
        <S.HorizontalList ref={scrollRefFollowings}>
          {user.Followings.length > 0 ? (
            user.Followings.map((following) => (
              <S.FollowItem
                key={following.id}
                onClick={() => handleGoToUserPage(following.id)}
              >
                <img
                  src={
                    following?.Image
                      ? `${baseURL}/${following?.Image?.src}`
                      : DEFAULT_AVATAR
                  }
                  alt={following.nickname}
                />
                <UserPageButton
                  userId={following.id}
                  content={following.nickname}
                />
              </S.FollowItem>
            ))
          ) : (
            <div style={{ padding: "10px", fontSize: "14px", opacity: 0.6 }}>
              팔로잉 중인 유저가 없습니다.
            </div>
          )}
        </S.HorizontalList>

        <S.SectionLabel>팔로워</S.SectionLabel>
        <S.HorizontalList ref={scrollRefFollowers}>
          {user.Followers.length > 0 ? (
            user.Followers.map((follower) => (
              <S.FollowItem
                key={follower.id}
                onClick={() => handleGoToUserPage(follower.id)}
              >
                <img
                  src={
                    follower?.Image
                      ? `${baseURL}/${follower?.Image?.src}`
                      : DEFAULT_AVATAR
                  }
                  alt={follower.nickname}
                />
                <UserPageButton
                  userId={follower.id}
                  content={follower.nickname}
                />
              </S.FollowItem>
            ))
          ) : (
            <div style={{ padding: "10px", fontSize: "14px", opacity: 0.6 }}>
              팔로워가 없습니다.
            </div>
          )}
        </S.HorizontalList>
      </section>

      <section>
        <S.SectionLabel>작성한 게시글</S.SectionLabel>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={
            <h4 style={{ textAlign: "center", margin: "20px 0" }}>
              불러오는 중...
            </h4>
          }
          endMessage={
            <p style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>
              모든 게시글을 확인했습니다.
            </p>
          }
          style={{ overflow: "visible" }}
        >
          <S.GridContainer>
            {posts.map((post) => (
              <S.PostItemCard
                key={post.id}
                onClick={() => goToUserPost(post.id)}
              >
                {Array.isArray(post.Images) && post.Images[0]?.src && (
                  <S.CardImg
                    src={`${baseURL}/${post.Images[0]?.src}`}
                    alt="Post"
                  />
                )}
                <S.CardBody>
                  <S.CardTitle>{post.title}</S.CardTitle>
                </S.CardBody>
              </S.PostItemCard>
            ))}
          </S.GridContainer>
        </InfiniteScroll>
      </section>
    </S.PageContainer>
  );
};

export default UserPage;
