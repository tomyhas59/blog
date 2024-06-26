export type PostType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userIdx: number;
  Likers: LikeType[];
  User: UserType;
  Images: ImageType[];
  Comments: CommentType[];
};

export type UserType = {
  id: number;
  email: string;
  nickname: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type LikeType = {
  id: number;
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
  PostId: number;
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
  sender: string;
  content: string;
  createdAt: string;
};
