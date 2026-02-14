import React, { useCallback, useEffect, useState } from "react";
import { API } from "@/contexts/API";
import { getErrorResponse, getUserAvatar } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { ImImage } from "react-icons/im";
import { formatDistanceToNow } from "date-fns";
import { PostProps } from "@/types/PostTypes";
import PostFooter from "./PostFooter";
import Badge from "@/ui/bagdes/Badge";
import { BsClock } from "react-icons/bs";
import ImageCarousel from "@/ui/carousel/ImageCarousel";
import Image from "next/image";
import PostCardSkeleton from "@/ui/loading/components/profile/PostCardSkeleton";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

const PostCard = ({
  post,
  user,
  authUser,
}: {
  post: PostProps;
  user: UserProps | null;
  authUser: UserProps | null;
}) => {
  return (
    <div className="bg-(--primary-bg) mb-6 overflow-hidden rounded-custom shadow-custom ">
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full relative border border-(--border) overflow-hidden object-cover">
            <Image
              fill
              src={getUserAvatar(user?.avatar || [])}
              alt={user?.name || "User"}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-(--text-color-emphasis)">
              {user?.name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1 sub-paragraph">
              <BsClock className="w-3 h-3 text-(--main)" />
              {formatDistanceToNow(new Date(post.createdAt))}
            </div>
          </div>
        </div>
      </div>
      {post?.text && (
        <p className="px-4 pb-3 leading-relaxed paragraph">{post?.text}</p>
      )}
      <ImageCarousel images={post?.all_images} />
      <PostFooter post={post} user={user} authUser={authUser} />
    </div>
  );
};

export default function PostSection({
  user,
  authUser,
}: {
  user: UserProps | null;
  authUser: UserProps | null;
}) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getPosts = useCallback(async () => {
    if (!user?._id) return;

    setIsFetching(true);

    try {
      const results = await Promise.allSettled([
        API.get(`/user/post/${user._id}`),
        API.get(`/user/all/post/like/${user._id}`),
      ]);

      const postsResult = results[0];
      const likesResult = results[1];

      const postData =
        postsResult.status === "fulfilled" ? postsResult.value.data : [];

      const likeData =
        likesResult.status === "fulfilled" ? likesResult.value.data : [];

      const filteredPosts = postData.filter(
        (po: PostProps) => po?.status === "approved" && !po?.is_private,
      );

      const finalData = filteredPosts.map((po: PostProps) => {
        const likeFound = likeData.find(
          (lk: { postId: string }) =>
            lk?.postId?.toString() === po?._id?.toString(),
        );
        return {
          ...po,
          likedBy: likeFound?.likedBy || [],
          all_images: po?.images?.map(
            (item: { compressed: string }) =>
              `${MEDIA_URL}/${item?.compressed}`,
          ),
        };
      });

      setPosts(finalData);

      if (postsResult.status === "rejected") {
        getErrorResponse(postsResult.reason, true);
      }

      if (likesResult.status === "rejected") {
        getErrorResponse(likesResult.reason, true);
      }
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsFetching(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isFetching) {
    return (
      <>
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </>
    );
  }

  if (!isFetching && (!posts || posts.length <= 0)) {
    return (
      <div className="mt-6 text-center py-16 bg-(--primary-bg) rounded-custom shadow-custom">
        <div className="w-16 h-16 bg-(--main) rounded-full flex items-center justify-center mx-auto mb-4 shadow-custom">
          <ImImage className="text-(--main-subtle) w-7 h-7" />
        </div>
        <h3 className="text-(--text-color-emphasis) font-bold text-lg">
          No posts yet
        </h3>
        <p className="text-(--text-color) text-sm mt-1 max-w-xs mx-auto">
          {user?.username} hasn&apos;t shared any updates or articles recently.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold mb-4 text-xl text-(--text-color-emphasis)">
          Recent Activity
        </h3>
        <Badge text={`${posts.length} Posts`} />
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            authUser={authUser}
          />
        ))}
      </div>
    </div>
  );
}
