import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { API } from "../../../../contexts/API";
import {
  getErrorResponse,
  getStatusColor,
  getSuccessResponse,
  getUserAvatar,
} from "../../../../contexts/CallBacks";
import { formatDistanceToNow } from "date-fns";
import { FiClock, FiMoreHorizontal } from "react-icons/fi";
import { BiPencil, BiGlobe, BiLockAlt } from "react-icons/bi";
import type { PostProps } from "../../../../types/PostTypes";
import { BsTrash2 } from "react-icons/bs";
import Badge from "../../../../ui/badge/Badge";

type PostHeaderProps = {
  post: PostProps;
  onSuccess?: () => void;
  setEditPost: React.Dispatch<React.SetStateAction<PostProps | null>>;
};

export default function PostHeader({
  post,
  onSuccess,
  setEditPost,
}: PostHeaderProps) {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleTogglePrivacy = async () => {
    startLoadingBar();
    setIsDropdownOpen(false);
    try {
      const response = await API.patch(`/user/post/private/${post._id}`);
      getSuccessResponse(response);
      if (onSuccess) onSuccess();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      stopLoadingBar();
    }
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setEditPost(post);
  };

  const handleDelete = async () => {
    setIsDropdownOpen(false);

    try {
      const result = await Swal.fire({
        title: "Delete Post?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        background: "var(--primary-bg)",
        color: "var(--text-color)",
      });

      if (result.isConfirmed) {
        startLoadingBar();
        const response = await API.delete(`/user/delete/post/${post._id}`);
        getSuccessResponse(response);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      getErrorResponse(error);
    } finally {
      stopLoadingBar();
    }
  };

  return (
    <div className="p-5 pb-2 relative">
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src={getUserAvatar(authUser?.avatar || [])}
            alt={authUser?.name || "User"}
            className="w-10 h-10 rounded-full border border-(--border) overflow-hidden object-cover"
          />
          <div>
            <h4 className="font-bold">{authUser?.name || "Unknown User"}</h4>
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
                dot
                children={post?.status}
                variant={getStatusColor(post?.status)}
              />
            </div>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-2 rounded-full transition-all ${
              isDropdownOpen
                ? "bg-(--main-subtle) text-(--main)"
                : "hover:bg-(--secondary-bg) text-(--text-subtle)"
            }`}
          >
            <FiMoreHorizontal size={18} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-(--primary-bg) border border-(--border) rounded-custom shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="flex flex-col p-1">
                <button
                  onClick={handleTogglePrivacy}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-(--main-subtle) hover:text-(--main) text-left transition-colors rounded-custom paragraph"
                >
                  {!post?.is_private ? (
                    <>
                      <BiLockAlt size={18} />
                      <span className="font-medium text-sm">Make Private</span>
                    </>
                  ) : (
                    <>
                      <BiGlobe size={18} />
                      <span className="font-medium text-sm">Make Public</span>
                    </>
                  )}
                </button>

                {post?.post_type !== "task" && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-(--main-subtle) hover:text-(--main) text-left transition-colors rounded-custom paragraph"
                  >
                    <BiPencil size={18} />
                    <span className="font-medium text-sm">Edit Post</span>
                  </button>
                )}

                <div className="my-1 border-t border-(--border)" />

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-(--danger-subtle) hover:text-(--danger) text-left transition-colors rounded-custom paragraph"
                >
                  <BsTrash2 size={18} />
                  <span className="font-medium text-sm">Delete Post</span>
                </button>
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
