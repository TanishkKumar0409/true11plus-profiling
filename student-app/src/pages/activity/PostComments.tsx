"use client";
import { useCallback, useEffect, useState } from "react";
import { API } from "../../contexts/API";
import { useParams } from "react-router-dom";
import { getErrorResponse } from "../../contexts/CallBacks";
import type { PostProps } from "../../types/PostTypes";
import PostCard from "./post_comments_components/PostCard";
import CommentSection from "./post_comments_components/CommentSection";

export default function SinglePostPage() {
  const { objectId } = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [postLoading, setPostLoading] = useState(true);

  const getPost = useCallback(async () => {
    setPostLoading(true);
    try {
      const response = await API.get(`/posts/${objectId}`);
      setPost(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setPostLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  if (postLoading) return <>loading...</>;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
            <PostCard post={post} />
          </div>
          <div className="lg:col-span-2 flex flex-col h-[85vh] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <CommentSection post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
