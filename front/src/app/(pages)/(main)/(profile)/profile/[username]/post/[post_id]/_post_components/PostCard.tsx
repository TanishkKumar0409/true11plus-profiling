import React, { useCallback, useEffect, useState } from "react";
import { BiLike, BiShare, BiTime } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa"; // Import filled icon
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { UserProps } from "@/types/UserProps";
import {
  formatDate,
  getErrorResponse,
  getUserAvatar,
} from "@/contexts/Callbacks";
import { PostProps } from "@/types/PostTypes";
import Image from "next/image";
import { API } from "@/contexts/API";
import SharePostModal from "../../../_profile_components/SharePostModal";

// --- Slider Component (Unchanged) ---
const PostImageSlider = ({ images }: { images: { compressed: string }[] }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="w-full aspect-4/3 bg-gray-100 border-y border-gray-100 relative group">
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${images[0]?.compressed}`}
          alt="Post content"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="post-card-swiper group cursor-pointer relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={1}
        navigation
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full h-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="aspect-4/3 group relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img?.compressed}`}
                alt={`Slide ${idx}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-3 group-hover:block hidden transition-all right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium z-10 pointer-events-none">
              {idx + 1} / {images.length}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// --- Main Card Component ---
// Added authUser prop to check if CURRENT user liked it
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

  // 1. Fetch Likes on Mount
  const getPostLikes = useCallback(async () => {
    if (!post?._id) return;
    try {
      const response = await API.get(`/user/post/like/${post?._id}`);
      // Assuming response.data.likedBy is an array of user IDs
      setLikedBy(response?.data?.likedBy || []);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [post?._id]);

  useEffect(() => {
    getPostLikes();
  }, [getPostLikes]);

  // 2. Check if current user likes this post
  const isLiked = authUser?._id ? likedBy.includes(authUser._id) : false;

  // 3. Handle Like Click (Optimistic)
  const handleLike = useCallback(async () => {
    if (!post?._id || !authUser?._id) return;

    // Optimistic Update
    const prevLikedBy = [...likedBy];

    if (isLiked) {
      // Remove user ID
      setLikedBy((prev) => prev.filter((id) => id !== authUser._id));
    } else {
      // Add user ID
      setLikedBy((prev) => [...prev, authUser._id!]);
    }

    try {
      await API.post(`/user/post/like/${post?._id}`);
    } catch (error) {
      // Revert on failure
      setLikedBy(prevLikedBy);
      getErrorResponse(error);
    }
  }, [post?._id, authUser?._id, isLiked, likedBy]);

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-50">
          <img
            src={getUserAvatar(user?.avatar || [])}
            className="w-10 h-10 rounded-full"
            alt="User"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-gray-900 truncate">
              {user?.name}
            </h4>
            <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
          </div>
        </div>

        {/* Slider */}
        <PostImageSlider images={post?.images || []} />

        {/* Content & Footer */}
        <div className="p-4">
          <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
            <BiTime />
            <span>{formatDate(post?.createdAt || "")}</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed mb-4 font-normal">
            {post?.text}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors group ${
                isLiked ? "text-blue-600 font-medium" : "hover:text-blue-600"
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

            {/* Share Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <BiShare size={18} /> Share
            </button>

            <SharePostModal
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
