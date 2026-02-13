import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import type { PostProps } from "../../../../types/PostTypes";
import type { UserProps } from "../../../../types/UserProps";
import ImageCarousel from "../../../../ui/carousel/ImageCarousel";
import { BiImage } from "react-icons/bi";

export default function Posts({
  posts,
  getPosts,
  user,
}: {
  posts: PostProps[];
  getPosts: () => void;
  user: UserProps | null;
}) {
  if (!posts || posts.length <= 0) {
    return (
      <div className="text-center py-12 bg-(--primary-bg) rounded-xl border border-(--border) border-dashed">
        <div className="w-16 h-16 bg-(--secondary-bg) rounded-full flex items-center justify-center mx-auto mb-3">
          <BiImage className="text-(--text-color) w-8 h-8" />
        </div>
        <h3 className="text-(--text-color-emphasis) font-medium">
          No activity yet
        </h3>
        <p className="text-(--text-color) text-sm mt-1">
          Posts from you and your connections will appear here.
        </p>
      </div>
    );
  }

  return (
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-(--primary-bg) mb-6 overflow-hidden rounded-custom shadow-custom"
        >
          <PostHeader user={user} post={post} onAction={getPosts} />
          <ImageCarousel images={post.all_images} />
          <PostFooter user={user} post={post} />
        </div>
      ))}
    </div>
  );
}
