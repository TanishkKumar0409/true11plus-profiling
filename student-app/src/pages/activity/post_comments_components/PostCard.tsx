import { useCallback, useEffect, useState } from "react";
import { BiShare } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa";
import type { PostProps } from "../../../types/PostTypes";
import { API } from "../../../contexts/API";
import {
  formatDate,
  getErrorResponse,
  getUserAvatar,
} from "../../../contexts/CallBacks";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import ShareModal from "../../../ui/modals/ShareModal";
import ImageCarousel from "../../../ui/carousel/ImageCarousel";

export default function PostCard({ post }: { post: PostProps | null }) {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
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
      <div className="w-full p-6 flex flex-col bg-(--primary-bg) shadow-custom rounded-custom">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-(--border)">
          <div className="w-12 h-12 rounded-full bg-(--secondary-bg) overflow-hidden border-2 border-(--border) shadow-custom">
            <img
              src={getUserAvatar(authUser?.avatar || [])}
              alt={authUser?.username || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold capitalize">{authUser?.name}</h4>
            <p className="text-(--main) font-medium">@{authUser?.username}</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden shadow-custom rounded-custom">
          <ImageCarousel images={post?.all_images || []} />
        </div>

        <div className="space-y-4 grow">
          <p className="font-medium sub-paragraph">
            {formatDate(post?.createdAt || "")}
          </p>
          <p className="font-medium italic border-l-4 border-(--main) pl-4">
            "{post?.text}"
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-(--border) pt-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 font-bold text-xs transition-all ${isLiked ? "text-(--main)" : "text-(--text-subtle) hover:text-(--main)"}`}
          >
            <FaThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
            <span>{likedBy.length} Likes</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center font-bold text-xs gap-1 text-(--text-subtle) hover:text-(--main) transition-colors"
          >
            <BiShare size={16} />
            Share
          </button>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          postUrl={
            post
              ? `${import.meta.env.VITE_FRONT_URL}/profile/${authUser?.username}/post/${post._id}`
              : ""
          }
        />
      </div>
    </div>
  );
}
