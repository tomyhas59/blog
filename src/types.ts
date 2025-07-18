export type UserType = {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  Followings: { id: number; nickname: string; Image?: ImageType }[];
  Followers: { id: number; nickname: string; Image?: ImageType }[];
  Image: ImageType;
  Notifications: NotificationType[];
  Posts: PostType[];
};

export type PostType = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userIdx: number;
  viewCount: number;
  Likers: LikeType[];
  User: UserType;
  Images: ImageType[];
  Comments: CommentType[];
  Replies: ReplyType[];
  Notifications: NotificationType[];
  Hashtags: HashtagType[];
};

export type HashtagType = {
  id: number;
  name: string;
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
  Replies: ReplyType[];
  User: UserType;
  Likers: LikeType[];
};

export type ReplyType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  PostId: number;
  Likers: LikeType[];
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

export type DataType = {
  filename: string;
  PostId: number;
  UserId: number;
  updatePost: PostType;
  CommentId: number;
  ReplyId: number;
  content: string;
};

export type MessageType = {
  id: number;
  content: string;
  UserId: number;
  ChatRoomId: number;
  User: UserType;
  createdAt: string;
  isRead: boolean;
};

export type NotificationType = {
  id: number;
  type: string;
  UserId: number;
  PostId: number;
  message: string;
  isRead: boolean;
};
