import { UserProps } from "./UserProps";

export interface PostProps {
  _id: string;
  text: string;
  images: { compressed: string; original: string }[];
  status: string;
  createdAt: string;
  likedBy: string[];
  is_private: boolean;
  all_images: string[];
}

export interface ReplyProps {
  id: number | string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface CommentProps {
  _id: string;
  postId: string;
  userId: UserProps;
  content: string;
  parentId: string | null;
  likedBy: string[];
  createdAt: string;
  updatedAt?: string;
  replies?: CommentProps[];
}
