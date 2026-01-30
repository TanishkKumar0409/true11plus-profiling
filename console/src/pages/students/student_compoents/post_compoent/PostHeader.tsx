import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  BiTime,
  BiGlobe,
  BiLockAlt,
  BiCheckCircle,
  BiXCircle,
  BiLoaderAlt,
} from "react-icons/bi";
import type { PostProps } from "../../../../types/PostTypes";
import {
  getStatusColor,
  getUserAvatar,
  getErrorResponse,
} from "../../../../contexts/Callbacks";
import Badge from "../../../../ui/badge/Badge";
import type { UserProps } from "../../../../types/UserProps";
import { API } from "../../../../contexts/API";
import toast from "react-hot-toast";

type PostHeaderProps = {
  post: PostProps;
  onAction?: (postId: string) => void;
  user: UserProps | null;
};

export default function PostHeader({ post, onAction, user }: PostHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsDropdownOpen(false);
    setLoading(true);
    try {
      const payload = {
        post_id: post._id,
        status: status,
      };

      await API.patch("/user/post/update/status", payload);

      toast.success(`Post successfully ${status}`);

      // Notify parent component to refresh data
      if (onAction) onAction(post._id);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 pb-2 relative">
      <div className="flex items-start justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <img
            src={getUserAvatar(user?.avatar || [])}
            alt={user?.name || "User"}
            className="w-11 h-11 rounded-full object-cover border border-gray-100 cursor-pointer"
          />

          <div>
            <h4 className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer">
              {user?.name || "Unknown User"}
            </h4>

            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
              <BiTime size={12} />
              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              <span>•</span>
              <span className="flex items-center gap-1 capitalize">
                {!post?.is_private ? (
                  <BiGlobe size={12} />
                ) : (
                  <BiLockAlt size={12} />
                )}
                {post?.is_private ? "Private" : "Public"}
              </span>
              <span>•</span>
              <Badge
                children={post?.status}
                variant={getStatusColor(post?.status)}
              />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            disabled={loading}
            className={`text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors ${
              isDropdownOpen ? "bg-gray-100 text-gray-600" : ""
            }`}
            type="button"
          >
            {loading ? (
              <BiLoaderAlt className="w-5 h-5 animate-spin text-purple-600" />
            ) : (
              <FiMoreHorizontal className="w-5 h-5" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Moderation
              </div>

              {post?.status !== "approved" && (
                <button
                  onClick={() => handleStatusUpdate("approved")}
                  className="w-full text-left px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 transition-colors"
                >
                  <BiCheckCircle size={18} />
                  Approve Post
                </button>
              )}
              {post?.status !== "rejected" && (
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <BiXCircle size={18} />
                  Reject Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <p className="text-sm text-gray-800 mt-3 whitespace-pre-wrap leading-relaxed">
        {post?.text || ""}
      </p>
    </div>
  );
}
