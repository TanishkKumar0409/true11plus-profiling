import { formatDistanceToNow } from "date-fns";
import { BiGlobe, BiLockAlt, BiCheckCircle, BiXCircle } from "react-icons/bi";
import type { PostProps } from "../../../../types/PostTypes";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
} from "../../../../contexts/Callbacks";
import Badge from "../../../../ui/badge/Badge";
import type { UserProps } from "../../../../types/UserProps";
import { FiClock, FiMoreHorizontal } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
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
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src={getUserAvatar(user?.avatar || [])}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-full border border-(--border) overflow-hidden object-cover"
          />
          <div>
            <h4 className="font-bold">{user?.name || "Unknown User"}</h4>

            <div className="flex items-center gap-1 sub-paragraph">
              <FiClock className="w-3 h-3 text-(--main)" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span className="mx-1 text-(--border)">|</span>
              {!post?.is_private ? (
                <BiGlobe className="w-3 h-3 text-(--main)" />
              ) : (
                <BiLockAlt className="w-3 h-3 text-(--main)" />
              )}
              <span className="text-xs font-medium">
                {post?.is_private ? "Private" : "Public"}
              </span>
              <span className="mx-1 text-(--border)">|</span>
              <Badge
                children={post?.status}
                variant={getStatusColor(post?.status)}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            disabled={loading}
            className={`p-2 rounded-full transition-all ${
              isDropdownOpen
                ? "bg-(--main-subtle) text-(--main)"
                : "hover:bg-(--secondary-bg) text-(--text-subtle)"
            }`}
            type="button"
          >
            <FiMoreHorizontal size={18} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-(--primary-bg) border border-(--border) rounded-custom shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="flex flex-col p-1">
                {post?.status !== "approved" && (
                  <button
                    onClick={() => handleStatusUpdate("approved")}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-(--success-subtle) hover:text-(--success)! text-left transition-colors rounded-custom paragraph"
                  >
                    <BiCheckCircle size={18} />
                    Approve Post
                  </button>
                )}
                {post?.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-(--danger-subtle) hover:text-(--danger)! text-left transition-colors rounded-custom paragraph"
                  >
                    <BiXCircle size={18} />
                    Reject Post
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <p className="px-8 pb-3 leading-relaxed text-(--text-color) paragraph whitespace-pre-wrap">
        {post?.text || ""}
      </p>
    </div>
  );
}
