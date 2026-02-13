"use client";
import { useCallback, useEffect, useState } from "react";
import { API } from "../../contexts/API";
import { useOutletContext, useParams } from "react-router-dom";
import { getErrorResponse } from "../../contexts/CallBacks";
import type { PostProps } from "../../types/PostTypes";
import PostCard from "./post_comments_components/PostCard";
import CommentSection from "./post_comments_components/CommentSection";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import type { DashboardOutletContextProps } from "../../types/Types";
import PostCommentSkeleton from "../../ui/loading/pages/PostCommentSkeleton";

export default function SinglePostPage() {
  const { objectId } = useParams();
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [post, setPost] = useState<PostProps | null>(null);
  const [postLoading, setPostLoading] = useState(true);

  const getPost = useCallback(async () => {
    startLoadingBar();
    setPostLoading(true);
    try {
      const response = await API.get(`/posts/${objectId}`);
      const data = response.data;
      setPost({
        ...data,
        all_images: data?.images?.map(
          (item: { compressed: string }) =>
            `${import.meta.env?.VITE_MEDIA_URL}/${item?.compressed}`,
        ),
      });
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setPostLoading(false);
      stopLoadingBar();
    }
  }, [objectId,,startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  if (postLoading) return <PostCommentSkeleton />;

  return (
    <div>
      <Breadcrumbs
        title="Activity"
        breadcrumbs={[
          { label: "Dashboard", path: "/" },
          { label: authUser?.username || "", path: "/profile" },
          { label: "Activity" },
        ]}
      />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
            <PostCard post={post} />
          </div>
          <div className="lg:col-span-2 flex flex-col bg-(--primary-bg) rounded-xl border border-(--border) shadow-sm overflow-hidden">
            <CommentSection post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
