import React from "react";

export type ImageType = {
  url: string;
};

export type NotificationType = {
  id: number;
  message: string;
  createdAt: string;
};

export type UserType = {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  Followings: { id: number; nickname: string }[];
  Followers: { id: number; nickname: string }[];
  Image: ImageType;
  Notifications: NotificationType[];
};

const dummyUser: UserType = {
  id: 1,
  email: "test@example.com",
  nickname: "테스트 유저",
  createdAt: "2025-06-04",
  updatedAt: "2025-06-04",
  Followings: [
    { id: 2, nickname: "친구1" },
    { id: 3, nickname: "친구2" },
  ],
  Followers: [{ id: 4, nickname: "팔로워1" }],
  Image: { url: "https://example.com/profile.jpg" },
  Notifications: [
    { id: 1, message: "새로운 알림이 있습니다!", createdAt: "2025-06-04" },
  ],
};

const UserPage = () => {
  return (
    <div>
      {/* 프로필 정보 */}
      <div>
        <img
          src={dummyUser.Image.url}
          alt={`${dummyUser.nickname} 프로필 이미지`}
          width={100}
        />
        <h1>{dummyUser.nickname}</h1>
        <p>Email: {dummyUser.email}</p>
        <p>가입 날짜: {dummyUser.createdAt}</p>
      </div>

      {/* 팔로잉 & 팔로워 목록 */}
      <div>
        <h2>팔로잉</h2>
        <ul>
          {dummyUser.Followings.map((following) => (
            <li key={following.id}>{following.nickname}</li>
          ))}
        </ul>

        <h2>팔로워</h2>
        <ul>
          {dummyUser.Followers.map((follower) => (
            <li key={follower.id}>{follower.nickname}</li>
          ))}
        </ul>
      </div>

      {/* 알림 목록 */}
      <div>
        <h2>알림</h2>
        <ul>
          {dummyUser.Notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} ({notification.createdAt})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPage;
