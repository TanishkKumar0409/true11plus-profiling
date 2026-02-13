import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiX, BiImageAdd, BiTrash, BiCloudUpload } from "react-icons/bi";
import { API } from "../../../../contexts/API";
import {
  getErrorResponse,
  getSuccessResponse,
  getUserAvatar,
} from "../../../../contexts/CallBacks";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import type { PostProps } from "../../../../types/PostTypes";
import { SecondButton } from "../../../../ui/buttons/Button";

interface EditPostModalProps {
  isOpen: PostProps | null;
  onClose: () => void;
  post: PostProps | null;
  onSuccess: () => void;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onSuccess,
}: EditPostModalProps) {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [text, setText] = useState(post?.text || "");
  const [existingImages, setExistingImages] = useState<any[]>(
    post?.images || [],
  );

  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setText(post.text);
      setExistingImages(post.images || []);
      setDeletedImages([]);
      setNewFiles([]);
      setNewPreviews([]);
    }
  }, [isOpen, post]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRemoveExisting = (indexToRemove: number) => {
    const imageToRemove = existingImages[indexToRemove];
    setDeletedImages((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages =
        existingImages.length + newFiles.length + filesArray.length;

      if (totalImages > 5) {
        Swal.fire(
          "Limit Reached",
          "You can only have up to 5 images total.",
          "warning",
        );
        return;
      }

      const validFiles = filesArray.filter((file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      );

      const newUrls = validFiles.map((file) => URL.createObjectURL(file));

      setNewFiles((prev) => [...prev, ...validFiles]);
      setNewPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveNew = (indexToRemove: number) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    startLoadingBar();
    if (!text.trim() && existingImages.length === 0 && newFiles.length === 0) {
      Swal.fire("Error", "Post cannot be empty", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("removeImages", JSON.stringify(deletedImages));
      newFiles.forEach((file) => {
        formData.append("images", file);
      });
      console.log(post?._id, ...formData);

      const response = await API.patch(
        `/user/edit/post/${post?._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      getSuccessResponse(response);
      onSuccess();
      onClose();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsSubmitting(false);
      stopLoadingBar();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-0 sm:p-4 mobile-overlay">
      <div className="absolute w-full h-full" onClick={onClose} />
      <div className="relative bg-(--primary-bg) w-full max-w-3xl flex flex-col h-[85vh] sm:h-auto max-h-[90vh] rounded-t-xl sm:rounded-lg overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="px-5 py-2 border-b border-(--border) flex justify-between items-center bg-(--secondary-bg) backdrop-blur-md sticky top-0 z-10">
          <h4>Edit Post</h4>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--main-subtle) text-(--text-subtle) hover:text-(--main) transition-colors rounded-custom"
          >
            <BiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          <div className="flex items-center gap-3">
            <img
              src={getUserAvatar(authUser?.avatar || [])}
              className="w-12 h-12 rounded-full border-2 border-(--border)"
              alt={authUser?.username || "User"}
            />
            <div>
              <p className="font-bold">{authUser?.name}</p>
              <p className="text-(--main)! font-bold uppercase sub-paragraph">
                Editing Mode
              </p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-30 sm:min-h-45 text-(--text-color) placeholder-(--text-subtle) outline-none resize-none bg-transparent paragraph"
            placeholder="What's on your mind?"
          />

          <div>
            {/* 1. Existing Images Grid */}
            {(existingImages.length > 0 || newPreviews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {existingImages.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative aspect-square overflow-hidden rounded-custom shadow-custom"
                  >
                    <img
                      src={`${import.meta.env.VITE_MEDIA_URL}${img.compressed}`}
                      alt={img?.compressed}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-overlay">
                      <button
                        onClick={() => handleRemoveExisting(idx)}
                        className="bg-(--danger-subtle) text-(--danger) p-2 transform scale-90 group-hover:scale-100 transition-transform rounded-custom"
                      >
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {newPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-custom overflow-hidden"
                  >
                    <img
                      src={src}
                      alt="New"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-overlay">
                      <button
                        onClick={() => handleRemoveNew(idx)}
                        className="bg-(--main-subtle) text-(--main) p-2 rounded-custom"
                      >
                        <BiX size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 bg-(--secondary-bg) border-t border-(--border)">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <label
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-(--main) shadow-sm transition-all font-bold text-sm rounded-custom ${existingImages.length + newFiles.length >= 5 ? "opacity-50 cursor-not-allowed" : "bg-(--white) hover:bg-(--main-subtle) cursor-pointer text-(--main)"}`}
              >
                <BiImageAdd size={22} className="text-(--main)" />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleNewFileChange}
                  disabled={existingImages.length + newFiles.length >= 5}
                />
              </label>
              <div>
                <p className="sub-paragraph font-bold uppercase tracking-tighter">
                  Photos
                </p>
                <p
                  className={`text-sm font-black ${existingImages.length + newFiles.length === 5 ? "text-(--main)" : "text-(--text-subtle)"}`}
                >
                  {existingImages.length + newFiles.length}/5
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <SecondButton label="Discard" onClick={onClose} />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-8 py-2 text-sm font-bold text-(--white) bg-(--main) hover:bg-(--main-emphasis) disabled:opacity-50 transition-all active:scale-95 rounded-custom shadow-custom text-shadow"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-(--border) border-t-(--border) rounded-full animate-spin" />
                ) : (
                  <>
                    <BiCloudUpload size={20} />
                    <span>Update Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
