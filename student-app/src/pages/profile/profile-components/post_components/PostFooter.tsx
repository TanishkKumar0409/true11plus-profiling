import { useState } from "react";
import { BiMessageSquare } from "react-icons/bi";
import { CiShare1 } from "react-icons/ci";
import { Link, useOutletContext } from "react-router-dom";
import type { PostProps } from "../../../../types/PostTypes";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { FaThumbsUp } from "react-icons/fa";
import ShareModal from "../../../../ui/modals/ShareModal";

const PostFooter = ({ post }: { post: PostProps | null }) => {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => setIsShareModalOpen(true);

  return (
    <div>
      <div className="px-4 py-3 flex justify-between sub-paragraph">
        <button className="flex items-center gap-1 hover:text-(--blue)">
          <FaThumbsUp className="w-4 h-4" />
          {post?.totalLikes || 0}
        </button>

        <Link
          to={`/activity/${post?._id}`}
          className="flex items-center gap-1 hover:text-(--main) transition-colors"
        >
          <BiMessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </Link>

        <button
          onClick={handleShareClick}
          className="flex items-center gap-1 hover:text-(--main)"
        >
          <CiShare1 className="w-4 h-4" />
          <span>Share</span>
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
  );
};

export default PostFooter;
