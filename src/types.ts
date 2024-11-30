export type UserType = {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  Followings: { id: number; nickname: string }[];
  Followers: { id: number; nickname: string }[];
  Image: ImageType;
};

export type PostType = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userIdx: number;
  Likers: LikeType[];
  User: UserType;
  Images: ImageType[];
  Comments: CommentType[];
};

export type LikeType = {
  id: number;
  nickname: string;
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  PostId: number;
  ReComments: ReCommentType[];
  User: UserType;
};

export type ReCommentType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  PostId: number;
  User: UserType;
};

export type ImageType = {
  id: number;
  src: string;
  createdAt: string;
  updatedAt: string;
  PostId: number | null;
  UserId: number | null;
};

export type Data = {
  filename: string;
  PostId: number;
  UserId: number;
  updatePost: PostType;
  CommnetId: number;
  ReCommnetId: number;
  content: string;
};

export type Message = {
  id: number;
  content: string;
  UserId: number;
  ChatRoomId: number;
  User: UserType;
  createdAt: string;
  isRead: boolean;
};
