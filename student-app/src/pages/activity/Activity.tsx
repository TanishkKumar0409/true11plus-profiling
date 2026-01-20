import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/Types";
import { getErrorResponse, getSuccessResponse, getUserAvatar } from "../../contexts/CallBacks";
import { BiX, BiImageAdd } from "react-icons/bi";
import { API } from "../../contexts/API";
import Posts from "./Posts";
import toast from "react-hot-toast";
import type { PostProps } from "../../types/PostTypes";


export default function Activity() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  // --- State ---
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // Form State
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // --- Fetch Posts ---
  const getPosts = useCallback(async () => {
    if (!authUser?._id) return;

    setIsFetching(true);

    try {
      const results = await Promise.allSettled([
        API.get(`/user/post/${authUser?._id}`),
        API.get(`/user/post/like-count/${authUser?._id}`),
      ]);

      const postsResult = results[0];
      const likesResult = results[1];

      const postData =
        postsResult.status === "fulfilled" ? postsResult.value.data : [];

      const likeData =
        likesResult.status === "fulfilled" ? likesResult.value.data || [] : [];

      const finalData = postData.map((po: PostProps) => {
        const likeFound = likeData.find((lk: { postId: string }) => lk?.postId === po?._id);
        return {
          ...po,
          totalLikes: likeFound?.totalLikes || 0,
        };
      });

      console.log(finalData);
      setPosts(finalData);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsFetching(false);
    }
  }, [authUser?._id]);


  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (selectedFiles.length + filesArray.length > 5) {
        toast.error("You can only upload a maximum of 5 images per post.")
        return;
      }

      const validFiles = filesArray.filter(file =>
        ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      );

      if (validFiles.length !== filesArray.length) {
        toast.error("Only JPG and PNG images are allowed.")
      }

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Create Post ---
  const handleCreatePost = async () => {
    if (!content.trim() && selectedFiles.length === 0) return;

    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", content);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await API.post("/user/create/post", formData);

      getSuccessResponse(response);

      setContent("");
      setSelectedFiles([]);
      setPreviews([]);
      setShowNewPostForm(false);

      getPosts();

    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="grid-cols-1 md:grid-cols-3 grid gap-6">
      <div className="md:col-span-2 space-y-6">

        {/* --- Create Post Widget --- */}
        <div className={`bg-white rounded-xl border transition-all duration-200 ${showNewPostForm ? 'border-gray-200 shadow-md ring-1 ring-gray-100' : 'border-gray-200 shadow-sm'}`}>
          {!showNewPostForm ? (
            // Collapsed View
            <div className="p-4 flex items-center gap-3">
              <img
                src={getUserAvatar(authUser?.avatar || [])}
                alt={authUser?.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
              <button
                onClick={() => setShowNewPostForm(true)}
                className="flex-1 text-left bg-gray-50 hover:bg-gray-100 text-gray-500 font-medium py-3 px-4 rounded-full transition-colors text-sm border border-gray-200"
              >
                Start a post...
              </button>
              <label className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-full cursor-pointer transition-colors" title="Upload Media">
                <BiImageAdd size={24} />
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  multiple
                  onChange={(e) => {
                    setShowNewPostForm(true);
                    handleImageChange(e);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            // Expanded View
            <div className="p-4 animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getUserAvatar(authUser?.avatar || [])}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    alt="User"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{authUser?.name}</h4>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BiX size={24} />
                </button>
              </div>

              {/* Text Area */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full p-0 border-none resize-none focus:ring-0 outline-none text-base placeholder-gray-400 min-h-[120px] text-gray-800 leading-relaxed"
                autoFocus
              />

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="mt-3 mb-2 overflow-x-auto pb-2 flex gap-2 no-scrollbar">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative group shrink-0 w-32 h-32">
                      <img
                        src={src}
                        alt={`Preview ${idx}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                      >
                        <BiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">

                {/* Add Media Button */}
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 cursor-pointer transition-colors ${selectedFiles.length >= 5
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : 'text-gray-500 hover:text-blue-600'
                      }`}
                    title="Add Photos"
                  >
                    <BiImageAdd size={24} />
                    <span className="text-sm font-medium">Photo</span>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      multiple
                      onChange={handleImageChange}
                      disabled={selectedFiles.length >= 5}
                      className="hidden"
                    />
                  </label>
                  {selectedFiles.length > 0 && (
                    <span className="text-xs text-gray-400 flex items-center bg-gray-50 px-2 rounded-full border border-gray-200">
                      {selectedFiles.length}/5
                    </span>
                  )}
                </div>

                {/* Post Button */}
                <button
                  onClick={handleCreatePost}
                  disabled={(!content.trim() && selectedFiles.length === 0) || isPosting}
                  className="px-6 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Feed Section --- */}
        <div className="space-y-5">
          {isFetching ? (
            // Simple Skeleton
            [1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
              </div>
            ))
          ) : (
            <Posts posts={posts} getPosts={getPosts} />
          )}
        </div>
      </div>
    </div>
  );
}