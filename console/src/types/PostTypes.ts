import type { UserProps } from "./UserProps";

export interface PostProps {
  _id: string;
  text: string;
  images: { compressed: string; original: string }[];
  status: string;
  createdAt: string;
  post_type: string;
  all_images: string[];
  is_private: boolean;
  totalLikes?:number
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
