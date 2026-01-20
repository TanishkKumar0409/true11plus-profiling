import React, { useEffect, useRef, useState } from "react";
import { BiCloudUpload, BiTrash, BiUser, BiX, BiCheck } from "react-icons/bi";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import { API } from "../../../../contexts/API";
import type { UserProps } from "../../../../types/UserTypes";
import {
  generateSlug,
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";

interface AvatarUploadProps {
  user: UserProps | null;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const { getAuthUser } = useOutletContext<DashboardOutletContextProps>();
  const [avatar, setAvatar] = useState(
    user?.avatar?.[0]
      ? `${import.meta.env.VITE_MEDIA_URL}/${user?.avatar?.[0]}`
      : ""
  );

  const [srcToCrop, setSrcToCrop] = useState<string | null>(null);

  const [originalFileName, setOriginalFileName] = useState(
    `${generateSlug(user?.username || "")}-avatar.png`
  );
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    setAvatar(
      user?.avatar?.[0]
        ? `${import.meta.env.VITE_MEDIA_URL}/${user?.avatar?.[0]}`
        : ""
    );
  }, [user?.avatar]);

  const triggerInput = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSrcToCrop(url);
    setOriginalFileName(file.name);
    if (inputRef.current) inputRef.current.value = "";
  };

  const canvasToFile = (canvas: HTMLCanvasElement, fileName: string) => {
    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to create image blob"));
          const file = new File([blob], fileName, {
            type: blob.type || "image/png",
          });
          resolve(file);
        },
        "image/png",
        1
      );
    });
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await API.patch(`/user/avatar/${user?._id}`, formData);
      getSuccessResponse(res);
      getAuthUser();
    } catch (error) {
      getErrorResponse(error);
    }
  };

  const handleCrop = async () => {
    try {
      if (!cropperRef.current) return;

      const canvas = cropperRef.current.getCanvas();
      if (!canvas) return;

      setIsUploading(true);

      const croppedDataUrl = canvas.toDataURL("image/png", 1);
      setAvatar(croppedDataUrl);

      const croppedFile = await canvasToFile(canvas, originalFileName);

      await uploadAvatar(croppedFile);
      setSrcToCrop(null);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelCrop = () => {
    setSrcToCrop(null);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/user/avatar/${user?._id}`);
      getSuccessResponse(response);
      getAuthUser();
    } catch (error) {
      getErrorResponse(error, true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-semibold text-gray-900">
          Profile Picture
        </label>
        <span className="text-xs text-gray-400">Ratio 1:1</span>
      </div>

      <div className="relative w-full aspect-[2/1] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <BiUser className="w-16 h-16" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 -z-10 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="flex flex-row items-center gap-3 mt-auto">
        <button
          onClick={triggerInput}
          disabled={isUploading}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <BiCloudUpload size={18} />
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {avatar && (
          <button
            onClick={handleDelete}
            disabled={isUploading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <BiTrash size={18} />
            Delete
          </button>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {srcToCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Crop Image</h3>
              <button
                onClick={handleCancelCrop}
                disabled={isUploading}
                className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <BiX size={24} />
              </button>
            </div>

            <div className="bg-gray-900 h-96 w-full">
              <Cropper
                ref={cropperRef}
                src={srcToCrop}
                className={"cropper"}
                stencilProps={{
                  aspectRatio: 1 / 1,
                  grid: true,
                }}
                backgroundClassName="bg-gray-900"
              />
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={handleCancelCrop}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={handleCrop}
                disabled={isUploading}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <BiCheck size={18} />
                {isUploading ? "Saving..." : "Apply Crop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
