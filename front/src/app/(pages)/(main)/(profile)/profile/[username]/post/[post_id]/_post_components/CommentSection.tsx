import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { BiHeart, BiReply, BiX, BiCommentDetail, BiLoaderAlt, BiTrash } from 'react-icons/bi';
import { FaHeart } from "react-icons/fa";
import { API } from '@/contexts/API';
import { getErrorResponse, getUserAvatar, formatDate } from '@/contexts/Callbacks';
import { CommentProps, PostProps } from '@/types/PostTypes';
import { UserProps } from '@/types/UserProps';
import toast from 'react-hot-toast';
import CommentFooter from './CommentFooter';
import Swal from 'sweetalert2';
import Link from 'next/link';

const normalizeComment = (data: any): CommentProps => {
    return {
        _id: data._id?.$oid || data._id,
        postId: data.postId?.$oid || data.postId,
        parentId: data.parentId?.$oid || data.parentId || null,
        content: data.content,
        createdAt: data.createdAt?.$date || data.createdAt,
        updatedAt: data.updatedAt?.$date || data.updatedAt,
        userId: data.userId?._id || data.userId?.$oid
            ? {
                ...data.userId,
                _id: data.userId._id?.$oid || data.userId._id || data.userId.$oid,
                name: data.userId.name || "Unknown",
                avatar: data.userId.avatar || []
            }
            : { _id: "unknown", name: "Unknown", username: "unknown", avatar: [] },
        likedBy: Array.isArray(data.likedBy)
            ? data.likedBy.map((id: any) => id?.$oid || id)
            : [],
        replies: []
    };
};

// --- 3. NESTING LOGIC ---
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
            } else { }
        } else {
            roots.push(commentMap[c._id]);
        }
    });

    Object.values(commentMap).forEach(c => {
        if (c.replies && c.replies.length > 0) {
            c.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
    });

    return roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const SingleCommentDisplay = ({
    comment,
    authUser,
    onReply,
    onDelete,
    isReply = false
}: {
    comment: CommentProps;
    authUser: UserProps | null;
    onReply: (comment: CommentProps) => void;
    onDelete: (commentId: string) => void;
    isReply?: boolean;
}) => {
    const hasLiked = comment.likedBy?.includes(authUser?._id || '');
    const [isLiked, setIsLiked] = useState(hasLiked);
    const [likeCount, setLikeCount] = useState(comment.likedBy?.length || 0);
    const isOwner = authUser?._id === comment.userId._id;

    const handleLike = async () => {
        if (!authUser) return toast.error("Please login to like");
        const prevLiked = isLiked;
        const prevCount = likeCount;
        setIsLiked(!isLiked);
        setLikeCount(prev => !prevLiked ? prev + 1 : prev - 1);
        try {
            await API.post(`/user/post/add/comment/like/${comment._id}`);
        } catch (error) {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            getErrorResponse(error);
        }
    };

    return (
        <div className={`flex gap-3 mb-3 group animate-in fade-in slide-in-from-bottom-1 ${isReply ? 'mt-2' : ''}`}>
            <img
                src={getUserAvatar(comment.userId.avatar)}
                alt={comment.userId.name}
                className={`${isReply ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover flex-shrink-0 mt-1 cursor-pointer`}
            />
            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2 border border-gray-100 relative group/box">
                    <div className="flex justify-between items-center mb-0.5">
                        <Link href={`/profile/${comment.userId.username}`} target='_blank' className="font-bold text-xs text-gray-900 cursor-pointer hover:underline">
                            {comment.userId.username}
                        </Link>
                        <span className="text-[10px] text-gray-400">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-snug whitespace-pre-wrap">{comment.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-1 ml-2 select-none">
                    <button
                        onClick={handleLike}
                        className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        {isLiked ? <FaHeart size={10} /> : <BiHeart size={12} />}
                        {likeCount > 0 ? likeCount : 'Like'}
                    </button>
                    <button
                        onClick={() => onReply(comment)}
                        className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                        <BiReply size={12} /> Reply
                    </button>
                    {isOwner && (
                        <button
                            onClick={() => onDelete(comment._id)}
                            className="text-[11px] font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                            title="Delete"
                        >
                            <BiTrash size={12} /> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 5. WRAPPER COMPONENT ---
const CommentTreeItem = ({
    comment,
    authUser,
    onReply,
    onDelete
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
                <div className="pl-10 relative">
                    <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-gray-100"></div>
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
            )}
        </div>
    );
};

// --- 6. MAIN CONTAINER ---
export default function CommentSection({
    post,
    authUser
}: {
    post: PostProps | null;
    authUser: UserProps | null;
}) {
    const [rawComments, setRawComments] = useState<CommentProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<CommentProps | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const fetchComments = useCallback(async () => {
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
        }
    }, [post?._id]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // --- DELETE LOGIC ---
    const handleDelete = async (commentId: string) => {
        const result = await Swal.fire({
            title: 'Delete Comment?',
            text: "This will remove the comment and any replies.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await API.delete(`/user/post/delete/comment/${commentId}`);
                toast.success(response?.data?.message);
                fetchComments()
            } catch (error) {
                getErrorResponse(error);
            }
        }
    };

    const nestedComments = useMemo(() => nestComments(rawComments), [rawComments]);

    const handleReplyClick = (comment: CommentProps) => {
        setReplyingTo(comment);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const onCommentAdded = () => {
        fetchComments();
    };

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center text-gray-400">
                <BiLoaderAlt className="animate-spin w-6 h-6" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <BiCommentDetail className="text-blue-600" />
                    Comments
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {rawComments.length}
                    </span>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
                {nestedComments.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 text-sm">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    <div className="space-y-1">
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

            <div className="bg-white border-t border-gray-100 p-4">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg mb-2 text-xs text-blue-700 animate-in slide-in-from-bottom-2">
                        <span>Replying to <b>{replyingTo.userId?.name}</b></span>
                        <button onClick={handleCancelReply} className="hover:bg-blue-100 p-1 rounded-full">
                            <BiX size={16} />
                        </button>
                    </div>
                )}

                <CommentFooter
                    authUser={authUser}
                    post={post}
                    replyingTo={replyingTo as any}
                    setReplyingTo={setReplyingTo as any}
                    inputRef={inputRef}
                    onCommentAdded={onCommentAdded}
                />
            </div>
        </div>
    );
}