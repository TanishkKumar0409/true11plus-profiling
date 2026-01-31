"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserProps } from "@/types/UserProps";
import { getErrorResponse } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import { PostProps } from "@/types/PostTypes";
import PostCard from "./_post_components/PostCard";
import RelatedUsers from "../../_profile_components/RelatedUsers";
import CommentSection from "./_post_components/CommentSection";

export default function SinglePostPage() {
  const { username, post_id } = useParams();
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostProps | null>(null);
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const router = useRouter();

  const getAuthUserUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/auth/user`);
      setAuthUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAuthUserUser();
  }, [getAuthUserUser]);

  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/user/username/${username}`);
      setUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const getPost = useCallback(async () => {
    setPostLoading(true);
    try {
      const response = await API.get(`/posts/${post_id}`);
      setPost(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setPostLoading(false);
    }
  }, [post_id]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  useEffect(() => {
    if (!postLoading) {
      if (post?.status !== "approved" || post?.is_private) {
        router.push(`/profile/${user?.username}`);
      }
    }
  }, [post, postLoading, user?.username, router]);

  if (loading) return <>loading...</>;
  if (postLoading) return <>loading...</>;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
            <PostCard user={user} post={post} authUser={authUser} />
          </div>
          <div className="lg:col-span-2 flex flex-col h-[85vh] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <CommentSection authUser={authUser} post={post} />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <RelatedUsers user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
