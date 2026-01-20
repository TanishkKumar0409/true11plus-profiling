import { API } from '@/contexts/API';
import { getErrorResponse, getUserAvatar } from '@/contexts/Callbacks'
import { CommentProps, PostProps } from '@/types/PostTypes';
import { UserProps } from '@/types/UserProps'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiLoaderAlt, BiSend } from 'react-icons/bi'

interface CommentFooterProps {
    authUser: UserProps | null;
    post: PostProps | null;
    replyingTo: CommentProps | null;
    setReplyingTo: (c: CommentProps | null) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    onCommentAdded: () => void;
}

export default function CommentFooter({
    authUser,
    post,
    replyingTo,
    setReplyingTo,
    inputRef,
    onCommentAdded
}: CommentFooterProps) {
    const [inputText, setInputText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!inputText.trim() || !post?._id) return;

        setIsSubmitting(true);
        try {
            const payload = {
                postId: post._id,
                content: inputText,
                parentId: replyingTo ? replyingTo._id : null
            };
            const response = await API.post('/user/post/add/comment', payload);

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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex gap-3 items-end">
            <img
                src={getUserAvatar(authUser?.avatar || [])}
                className="w-9 h-9 rounded-full mb-1 border border-gray-200"
                alt="Me"
            />
            <div className="flex-1 bg-gray-100 rounded-2xl p-1.5 flex items-center transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white border border-transparent focus-within:border-blue-200">
                <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={replyingTo ? `Reply to ${replyingTo.userId?.name || 'user'}...` : "Write a comment..."}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm px-3 py-2 resize-none max-h-24 min-h-[40px] text-gray-800 placeholder-gray-400"
                    rows={1}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!inputText.trim() || isSubmitting}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mr-0.5 shadow-sm active:scale-95 flex items-center justify-center"
                >
                    {isSubmitting ? <BiLoaderAlt className="animate-spin" /> : <BiSend size={18} />}
                </button>
            </div>
        </div>
    )
}