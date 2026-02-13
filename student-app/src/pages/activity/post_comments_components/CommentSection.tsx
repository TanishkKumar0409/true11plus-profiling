import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import {
  BiHeart,
  BiReply,
  BiX,
  BiTrash,
  BiMessageSquare,
} from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import type { UserProps } from "../../../types/UserTypes";
import type { CommentProps, PostProps } from "../../../types/PostTypes";
import { API } from "../../../contexts/API";
import {
  formatDate,
  getErrorResponse,
  getUserAvatar,
} from "../../../contexts/CallBacks";
import { Link, useOutletContext } from "react-router-dom";
import CommentFooter from "./CommentFooter";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { FiMessageCircle } from "react-icons/fi";
import PostCommentSectionSkeleton from "../../../ui/loading/pages/PostCommentSectionSkeleton";

const normalizeComment = (data: any): CommentProps => {
  return {
    _id: data._id?.$oid || data._id,
    postId: data.postId?.$oid || data.postId,
    parentId: data.parentId?.$oid || data.parentId || null,
    content: data.content,
    createdAt: data.createdAt?.$date || data.createdAt,
    updatedAt: data.updatedAt?.$date || data.updatedAt,
    userId:
      data.userId?._id || data.userId?.$oid
        ? {
            ...data.userId,
            _id: data.userId._id?.$oid || data.userId._id || data.userId.$oid,
            name: data.userId.name || "Unknown",
            avatar: data.userId.avatar || [],
          }
        : { _id: "unknown", name: "Unknown", username: "unknown", avatar: [] },
    likedBy: Array.isArray(data.likedBy)
      ? data.likedBy.map((id: any) => id?.$oid || id)
      : [],
    replies: [],
  };
};

const nestComments = (comments: CommentProps[]): CommentProps[] => {
  const commentMap: { [key: string]: CommentProps } = {};
  const roots: CommentProps[] = [];

  comments.forEach((c) => {
    commentMap[c._id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    if (c.parentId) {
      const parent = commentMap[c.parentId];
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentMap[c._id]);
      }
    } else {
      roots.push(commentMap[c._id]);
    }
  });

  Object.values(commentMap).forEach((c) => {
    if (c.replies && c.replies.length > 0) {
      c.replies.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
  });

  return roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

const SingleCommentDisplay = ({
  comment,
  authUser,
  onReply,
  onDelete,
  isReply = false,
}: {
  comment: CommentProps;
  authUser: UserProps | null;
  onReply: (comment: CommentProps) => void;
  onDelete: (commentId: string) => void;
  isReply?: boolean;
}) => {
  const hasLiked = comment.likedBy?.includes(authUser?._id || "");
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(comment.likedBy?.length || 0);
  const isOwner = authUser?._id === comment.userId._id;

  const handleLike = async () => {
    if (!authUser) return toast.error("Please login to like");
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount((prev) => (!prevLiked ? prev + 1 : prev - 1));
    try {
      await API.post(`/user/post/add/comment/like/${comment._id}`);
    } catch (error) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      getErrorResponse(error);
    }
  };

  return (
    <div className={`flex gap-4 ${isReply ? "mt-4" : ""}`}>
      <Link
        to={`${import.meta.env.VITE_FRONT_URL}/profile/${comment.userId.username}`}
        target="_blank"
        className="shrink-0"
      >
        <div
          className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-(--main-subtle) flex items-center justify-center text-(--main) font-bold text-xs border border-(--border) shadow-custom overflow-hidden`}
        >
          <img
            src={getUserAvatar(comment.userId.avatar)}
            alt={comment.userId.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="grow space-y-2 min-w-0">
        <div className="bg-(--secondary-bg) p-3 rounded-lg rounded-tl-none shadow-custom">
          <div className="flex justify-between items-center mb-1 gap-2">
            <span className="font-bold text-xs text-(--text-color)! truncate">
              {comment.userId.name}
            </span>
            <span className="text-[10px] font-semibold uppercase text-(--text-subtle) shrink-0">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-(--text-color) leading-snug whitespace-pre-wrap wrap-break-word">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-6 px-1 text-(--text-subtle)">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
              isLiked ? "text-(--danger)" : "hover:text-(--danger)"
            }`}
          >
            {isLiked ? <FaHeart size={12} /> : <BiHeart size={12} />}
            {likeCount > 0 && likeCount} Like
          </button>

          {/* User cannot reply to a reply - Button hidden if isReply is true */}
          {!isReply && (
            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-xs font-bold hover:text-(--main) transition-colors"
            >
              <BiReply size={14} />
              Reply
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="flex items-center gap-1 text-xs font-bold hover:text-(--danger) transition-colors ml-auto"
            >
              <BiTrash size={12} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentTreeItem = ({
  comment,
  authUser,
  onReply,
  onDelete,
}: {
  comment: CommentProps;
  authUser: UserProps | null;
  onReply: (comment: CommentProps) => void;
  onDelete: (commentId: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <SingleCommentDisplay
        comment={comment}
        authUser={authUser}
        onReply={onReply}
        onDelete={onDelete}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-10 mt-4 relative">
          <div className="absolute left-5 top-0 bottom-4 w-0.5 bg-(--border)"></div>
          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <SingleCommentDisplay
                key={reply._id}
                comment={reply}
                authUser={authUser}
                onReply={onReply}
                onDelete={onDelete}
                isReply={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ post }: { post: PostProps | null }) {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [rawComments, setRawComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<CommentProps | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchComments = useCallback(async () => {
    startLoadingBar();
    if (!post?._id) return;
    try {
      const response = await API.get(`/user/post/comment/${post._id}`);
      const sanitizedData = Array.isArray(response.data)
        ? response.data.map(normalizeComment)
        : [];
      setRawComments(sanitizedData);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [post?._id, , startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (commentId: string) => {
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: "This will remove the comment and any replies.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        startLoadingBar();
        const response = await API.delete(
          `/user/post/delete/comment/${commentId}`,
        );
        toast.success(response?.data?.message);
        fetchComments();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        stopLoadingBar();
      }
    }
  };

  const nestedComments = useMemo(
    () => nestComments(rawComments),
    [rawComments],
  );

  const handleReplyClick = (comment: CommentProps) => {
    setReplyingTo(comment);
    if (inputRef.current) inputRef.current.focus();
  };

  const onCommentAdded = () => {
    fetchComments();
    setReplyingTo(null);
  };

  if (loading) return <PostCommentSectionSkeleton />;

  return (
    <div className="w-full flex flex-col overflow-hidden bg-(--primary-bg) shadow-custom rounded-custom h-132">
      <div className="px-6 py-3 border-b border-(--border) bg-(--primary-bg) backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BiMessageSquare size={18} className="text-(--main)" />
          <h4 className="font-bold">Comments</h4>
          <span className="bg-(--secondary-bg) text-(--main) text-sm font-bold py-1 px-2 rounded-custom">
            {rawComments.length}
          </span>
        </div>
      </div>

      <div className="grow overflow-y-auto p-6 space-y-8">
        {nestedComments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center rounded-custom bg-(--main-subtle)">
            <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-(--white) shadow-sm">
              <FiMessageCircle className="w-8 h-8 text-(--main)" />
            </div>
            <h4 className="font-semibold text-(--text-color)">
              No comments yet
            </h4>
            <p className="mt-1 max-w-xs text-(--text-subtle) text-sm px-4">
              Be the first to share your thoughts and start the conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {nestedComments.map((comment) => (
              <CommentTreeItem
                key={comment._id}
                comment={comment}
                authUser={authUser}
                onReply={handleReplyClick}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-(--border) bg-(--primary-bg)">
        {replyingTo && (
          <div className="flex items-center justify-between bg-(--main-subtle) px-3 py-1.5 rounded-custom border border-(--border) text-[11px] text-(--main) animate-in slide-in-from-bottom-2">
            <span className="font-medium">
              Replying to <b className="font-bold">{replyingTo.userId?.name}</b>
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="hover:bg-(--white) p-0.5 rounded-full transition-colors"
            >
              <BiX size={14} />
            </button>
          </div>
        )}

        <div className={`${replyingTo ? "pt-2" : ""}`}>
          <CommentFooter
            post={post}
            replyingTo={replyingTo as any}
            setReplyingTo={setReplyingTo as any}
            inputRef={inputRef}
            onCommentAdded={onCommentAdded}
          />
        </div>
      </div>
    </div>
  );
}
