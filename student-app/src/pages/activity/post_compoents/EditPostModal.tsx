import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiX, BiImageAdd, BiTrash } from "react-icons/bi";
import { API } from "../../../contexts/API";
import { getErrorResponse, getSuccessResponse, getUserAvatar } from "../../../contexts/CallBacks";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import type { PostProps } from "../../../types/PostTypes";

interface EditPostModalProps {
    isOpen: PostProps | null;
    onClose: () => void;
    post: PostProps | null;
    onSuccess: () => void;
}

export default function EditPostModal({ isOpen, onClose, post, onSuccess }: EditPostModalProps) {
    const { authUser } = useOutletContext<DashboardOutletContextProps>()
    const [text, setText] = useState(post?.text || "");
    const [existingImages, setExistingImages] = useState<any[]>(post?.images || []);

    const [deletedImages, setDeletedImages] = useState<any[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (isOpen && post) {
            setText(post.text);
            setExistingImages(post.images || []);
            setDeletedImages([]); // Reset deleted tracking
            setNewFiles([]);
            setNewPreviews([]);
        }
    }, [isOpen, post]);

    // --- Scroll Lock ---
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    // --- Handlers ---

    // 1. Remove an EXISTING image (Add to deleted list, remove from UI)
    const handleRemoveExisting = (indexToRemove: number) => {
        const imageToRemove = existingImages[indexToRemove];

        // Add to deleted tracking
        setDeletedImages((prev) => [...prev, imageToRemove]);

        // Remove from visual list
        setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // 2. Add NEW files
    const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Calculate total visible images (Existing Left + New Added)
            const totalImages = existingImages.length + newFiles.length + filesArray.length;

            if (totalImages > 5) {
                Swal.fire("Limit Reached", "You can only have up to 5 images total.", "warning");
                return;
            }

            // Filter valid types
            const validFiles = filesArray.filter(file =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
            );

            const newUrls = validFiles.map((file) => URL.createObjectURL(file));

            setNewFiles((prev) => [...prev, ...validFiles]);
            setNewPreviews((prev) => [...prev, ...newUrls]);
        }
    };

    // 3. Remove a NEWly added file
    const handleRemoveNew = (indexToRemove: number) => {
        setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // 4. Submit
    const handleSubmit = async () => {
        // Validation: Cannot have empty text AND no images
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

            const response = await API.patch(`/user/edit/post/${post?._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            getSuccessResponse(response);
            onSuccess(); // Refresh feed
            onClose();   // Close modal
        } catch (error) {
            getErrorResponse(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // --- Portal Render ---
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Edit Post</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <BiX size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={getUserAvatar(authUser?.avatar || [])}
                            className="w-10 h-10 rounded-full border border-gray-100"
                            alt="User"
                        />
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">{authUser?.name}</h4>
                            <span className="text-xs text-gray-500">Editing...</span>
                        </div>
                    </div>

                    {/* Text Input */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full min-h-[120px] resize-none outline-none border-none focus:ring-0 p-0 text-base text-gray-800 placeholder-gray-400"
                        placeholder="What do you want to talk about?"
                    />

                    {/* --- IMAGES SECTION --- */}
                    <div className="mt-4 space-y-3">

                        {/* 1. Existing Images Grid */}
                        {existingImages.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Kept Images</p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {existingImages.map((img: any, idx: number) => (
                                        <div key={idx} className="relative group flex-shrink-0 w-24 h-24">
                                            <img
                                                src={`${import.meta.env.VITE_MEDIA_URL}${img.compressed}`}
                                                alt="Old"
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() => handleRemoveExisting(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                title="Remove"
                                            >
                                                <BiTrash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. New Images Grid */}
                        {newPreviews.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-green-600 uppercase mb-2">New Images</p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {newPreviews.map((src, idx) => (
                                        <div key={idx} className="relative group flex-shrink-0 w-24 h-24">
                                            <img
                                                src={src}
                                                alt="New"
                                                className="w-full h-full object-cover rounded-lg border-2 border-green-100"
                                            />
                                            <button
                                                onClick={() => handleRemoveNew(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <BiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    {/* Add Media Button */}
                    <div className="flex items-center gap-3">
                        <label
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${(existingImages.length + newFiles.length) >= 5
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                : 'hover:bg-white hover:shadow-sm text-gray-600 hover:text-blue-600 border border-transparent hover:border-gray-200'
                                }`}
                        >
                            <BiImageAdd size={22} />
                            <span className="text-sm font-medium">Add Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleNewFileChange}
                                disabled={(existingImages.length + newFiles.length) >= 5}
                            />
                        </label>
                        <span className="text-xs text-gray-400">
                            {existingImages.length + newFiles.length}/5
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}