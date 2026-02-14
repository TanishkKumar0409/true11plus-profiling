import React, { useCallback, useEffect, useState } from "react";
import { BiLike, BiShare, BiTime } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa";
import { UserProps } from "@/types/UserProps";
import {
  formatDate,
  getErrorResponse,
  getUserAvatar,
} from "@/contexts/Callbacks";
import { PostProps } from "@/types/PostTypes";
import { API } from "@/contexts/API";
import ShareModal from "@/ui/modals/ShareModal";
import ImageCarousel from "@/ui/carousel/ImageCarousel";
import Image from "next/image";

export default function PostCard({
  user,
  post,
  authUser,
}: {
  user: UserProps | null;
  post: PostProps | null;
  authUser: UserProps | null;
}) {
  const [likedBy, setLikedBy] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const getPostLikes = useCallback(async () => {
    if (!post?._id) return;
    try {
      const response = await API.get(`/user/post/like/${post?._id}`);
      setLikedBy(response?.data?.likedBy || []);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [post?._id]);

  useEffect(() => {
    getPostLikes();
  }, [getPostLikes]);

  const isLiked = authUser?._id ? likedBy.includes(authUser._id) : false;

  const handleLike = useCallback(async () => {
    if (!post?._id || !authUser?._id) return;
    const prevLikedBy = [...likedBy];

    if (isLiked) {
      setLikedBy((prev) => prev.filter((id) => id !== authUser._id));
    } else {
      setLikedBy((prev) => [...prev, authUser._id!]);
    }

    try {
      await API.post(`/user/post/like/${post?._id}`);
    } catch (error) {
      setLikedBy(prevLikedBy);
      getErrorResponse(error);
    }
  }, [post?._id, authUser?._id, isLiked, likedBy]);

  return (
    <div>
      <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image src={getUserAvatar(user?.avatar || [])} alt="User" fill />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-(--text-color-emphasis) truncate">
              {user?.name}
            </h4>
            <p className="text-xs text-(--text-color) truncate">
              @{user?.username}
            </p>
          </div>
        </div>
        <ImageCarousel images={post?.all_images || []} />
        <div className="p-4">
          <div className="flex items-center text-xs text-(--text-color) mb-2 gap-1">
            <BiTime />
            <span>{formatDate(post?.createdAt || "")}</span>
          </div>
          {post?.text && (
            <p className="text-sm text-(--text-color-emphasis) leading-relaxed mb-4 font-normal">
              {post?.text}
            </p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-(--border) text-sm text-(--text-color)">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors group ${
                isLiked ? "text-(--main) font-medium" : "hover:text-(--main)"
              }`}
            >
              {isLiked ? (
                <FaThumbsUp
                  size={18}
                  className="scale-110 transition-transform"
                />
              ) : (
                <BiLike
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
              <span>{likedBy.length} Likes</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 hover:text-(--main) transition-colors"
            >
              <BiShare size={18} /> Share
            </button>

            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              postUrl={
                post
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user?.username}/post/${post._id}`
                  : ""
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
