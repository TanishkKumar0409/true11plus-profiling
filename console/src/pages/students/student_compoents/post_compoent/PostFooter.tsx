import { useState } from "react";
import { BiMessageSquare } from "react-icons/bi";
import { CiShare1 } from "react-icons/ci";
import ShareModal from "../../../../ui/modals/ShareModal";
import type { PostProps } from "../../../../types/PostTypes";
import type { UserProps } from "../../../../types/UserProps";
import { Link } from "react-router-dom";
import { BsFillHandThumbsUpFill } from "react-icons/bs";

const PostFooter = ({
  post,
  user,
}: {
  post: PostProps | null;
  user: UserProps | null;
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => setIsShareModalOpen(true);

  return (
    <div>
      <div className="px-4 py-3 flex justify-between sub-paragraph">
        <button className="flex items-center gap-1 hover:text-(--blue)">
          <BsFillHandThumbsUpFill className="w-4 h-4" />
          {post?.totalLikes || 0}
        </button>

        <Link
          to={`/dashboard/student/${user?._id}/post/${post?._id}`}
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
            ? `${import.meta.env.VITE_FRONT_URL}/profile/${user?.username}/post/${post._id}`
            : ""
        }
      />
    </div>
  );
};

export default PostFooter;
