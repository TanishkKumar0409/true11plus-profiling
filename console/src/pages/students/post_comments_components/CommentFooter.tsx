import toast from "react-hot-toast";
import { BiLoaderAlt, BiSend } from "react-icons/bi";
import type { CommentProps, PostProps } from "../../../types/PostTypes";
import { useState } from "react";
import { API } from "../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { getErrorResponse, getUserAvatar } from "../../../contexts/Callbacks";

interface CommentFooterProps {
  post: PostProps | null;
  replyingTo: CommentProps | null;
  setReplyingTo: (c: CommentProps | null) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onCommentAdded: () => void;
}

export default function CommentFooter({
  post,
  replyingTo,
  setReplyingTo,
  inputRef,
  onCommentAdded,
}: CommentFooterProps) {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!inputText.trim() || !post?._id) return;

    setIsSubmitting(true);
    try {
      const payload = {
        postId: post._id,
        content: inputText,
        parentId: replyingTo ? replyingTo._id : null,
      };
      const response = await API.post("/user/post/add/comment", payload);

      toast.success(response?.data?.message);
      setInputText("");
      setReplyingTo(null);

      // Trigger refresh in parent
      onCommentAdded();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-3 max-w-4xl mx-auto">
      <div className="w-10 h-10 rounded-full bg-(--secondary-bg) overflow-hidden border-2 border-(--border) shadow-custom">
        <img
          src={getUserAvatar(authUser?.avatar || [])}
          alt={authUser?.username}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative grow">
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            replyingTo
              ? `Reply to ${replyingTo.userId?.name || "user"}...`
              : "Write a comment..."
          }
          className="w-full bg-(--secondary-bg) border border-(--border) rounded-custom py-2.5 px-5 pr-14 focus:ring-1 focus:ring-(--main-subtle) focus:bg-(--primary-bg) paragraph"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || isSubmitting}
          className="absolute right-2 bottom-2 p-2 bg-(--main) text-(--white) hover:bg-(--main-emphasis) transition-all active:scale-95 disabled:opacity-30 shadow-custom rounded-custom"
        >
          {isSubmitting ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            <BiSend size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
