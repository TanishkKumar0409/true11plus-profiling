import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/Types";
import Swal from "sweetalert2";
import { API } from "../../contexts/API";
import { getErrorResponse, getSuccessResponse, getUserAvatar } from "../../contexts/CallBacks";
import { formatDistanceToNow } from "date-fns";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiTime, BiPencil, BiTrash } from "react-icons/bi";
import type { PostProps } from "../../types/PostTypes";


type PostHeaderProps = {
    post: PostProps;
    onDelete?: (postId: string) => void;
    setEditPost: React.Dispatch<React.SetStateAction<PostProps | null>>
};

export default function PostHeader({ post, onDelete, setEditPost }: PostHeaderProps) {
    const { authUser } = useOutletContext<DashboardOutletContextProps>();

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

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            });

            if (result.isConfirmed) {
                const response = await API.delete(`/user/delete/post/${post._id}`);
                getSuccessResponse(response);

                if (onDelete) onDelete(post._id);
            }
        } catch (error) {
            getErrorResponse(error);
        }
    };

    return (
        <div className="p-5 pb-2 relative">
            <div className="flex items-start justify-between">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                    <img
                        src={getUserAvatar(authUser?.avatar || [])}
                        alt={authUser?.name || "User"}
                        className="w-11 h-11 rounded-full object-cover border border-gray-100 cursor-pointer"
                    />

                    <div>
                        <h4 className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer">
                            {authUser?.name || "Unknown User"}
                        </h4>

                        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                            <BiTime size={12} />
                            <span>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </span>
                            <span>•</span>
                            <span>{post?.status}</span>
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className={`text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors ${isDropdownOpen ? "bg-gray-100 text-gray-600" : ""
                            }`}
                        type="button"
                    >
                        <FiMoreHorizontal className="w-5 h-5" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => setEditPost(post)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                type="button"
                            >
                                <BiPencil className="text-gray-500" size={16} />
                                Edit Post
                            </button>

                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                type="button"
                            >
                                <BiTrash className="text-red-500" size={16} />
                                Delete Post
                            </button>
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
