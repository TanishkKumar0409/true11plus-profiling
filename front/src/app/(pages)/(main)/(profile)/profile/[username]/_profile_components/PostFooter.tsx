import { useCallback, useEffect, useState } from "react";
import { BiLike, BiMessageSquare } from "react-icons/bi";
import { CiShare1 } from "react-icons/ci";
import SharePostModal from "./SharePostModal";
import { PostProps } from "@/types/PostTypes";
import { UserProps } from "@/types/UserProps";
import { getErrorResponse } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import { FaThumbsUp } from "react-icons/fa6";
import Link from "next/link";

const PostFooter = ({ post, user, authUser }: { post: PostProps | null; user: UserProps | null, authUser: UserProps | null }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (post && authUser) {
            setIsLiked(post.likedBy?.includes(authUser._id || "") || false);
            setLikeCount(post.likedBy?.length || 0);
        }
    }, [post, authUser]);
    const handleLike = useCallback(async () => {
        if (!post?._id) return;
        const previousLiked = isLiked;
        const previousCount = likeCount;
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

        try {
            await API.post(`/user/post/like/${post?._id}`);
        } catch (error) {
            getErrorResponse(error)
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            getErrorResponse(error);
        }
    }, [post?._id, isLiked, likeCount]);

    return (
        <div>
            <div className="flex items-center justify-between px-2 py-1">
                <button
                    onClick={handleLike}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors group"
                >
                    {/* Render based on Local State */}
                    {!isLiked ? (
                        <BiLike className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <FaThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-500" />
                    )}

                    <span className={isLiked ? "text-blue-500" : ""}>
                        Like {likeCount > 0 ? likeCount : ""}
                    </span>
                </button>

                <Link href={`/profile/${user?.username}/post/${post?._id}`} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
                    <BiMessageSquare className="w-5 h-5" />
                    <span>Comment</span>
                </Link>

                <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                    <CiShare1 className="w-5 h-5" />
                    <span>Share</span>
                </button>
            </div>

            <SharePostModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                postUrl={post ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user?.username}/post/${post._id}` : ""}
            />
        </div>
    );
};

export default PostFooter;