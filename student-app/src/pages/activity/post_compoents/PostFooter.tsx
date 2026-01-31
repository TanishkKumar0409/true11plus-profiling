import { useState } from "react";
import { BiLike, BiMessageSquare } from "react-icons/bi";
import { CiShare1 } from "react-icons/ci";
import SharePostModal from "./SharePostModal";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import type { PostProps } from "../../../types/PostTypes";

const PostFooter = ({ post }: { post: PostProps | null }) => {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // const handleShareClick = () => setIsShareModalOpen(true);

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold hover:bg-gray-50 text-blue-600 rounded-lg transition-colors group">
          <BiLike className="w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
          {post?.totalLikes}
        </button>
        {/* <Link
          to={`/activity/${post?._id}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
        >
          <BiMessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </Link> */}
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
          <BiMessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button
          // onClick={handleShareClick}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
        >
          <CiShare1 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postUrl={
          post
            ? `${import.meta.env.VITE_FRONT_URL}/profile/${authUser?.username}/post/${post._id}`
            : ""
        }
      />
    </div>
  );
};

export default PostFooter;
