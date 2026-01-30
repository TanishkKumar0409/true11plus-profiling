import { BiLike, BiMessageSquare } from "react-icons/bi";

const PostFooter = ({ post }: { post: any | null }) => {
  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold hover:bg-gray-50 text-blue-600 rounded-lg transition-colors group">
          <BiLike className="w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
          {post?.totalLikes}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
          <BiMessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostFooter;
