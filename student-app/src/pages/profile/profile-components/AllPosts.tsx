import { useState } from "react";
import type { PostProps } from "../../../types/PostTypes";
import PostHeader from "./post_components/PostHeader";
import ImageCarousel from "../../../ui/carousel/ImageCarousel";
import PostFooter from "./post_components/PostFooter";
import EditPostModal from "./post_components/EditPostModal";
import { BiImage } from "react-icons/bi";

export default function AllPosts({
  posts,
  getPosts,
}: {
  posts: PostProps[];
  getPosts: () => void;
}) {
  const [editPost, setEditPost] = useState<PostProps | null>(null);

  return (
    <div>
      {posts?.length <= 0 ? (
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
      ) : (
        posts?.map((post, index) => (
          <div
            key={index}
            className="bg-(--primary-bg) mb-6 overflow-hidden rounded-custom shadow-custom"
          >
            <PostHeader
              post={post}
              onSuccess={getPosts}
              setEditPost={setEditPost}
            />
            <ImageCarousel images={post.all_images} />
            <PostFooter post={post} />
          </div>
        ))
      )}
      <EditPostModal
        isOpen={editPost}
        post={editPost}
        onClose={() => setEditPost(null)}
        onSuccess={getPosts}
      />
    </div>
  );
}
