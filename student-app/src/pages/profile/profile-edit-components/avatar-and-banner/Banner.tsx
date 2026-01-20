import React, { useEffect, useRef, useState } from "react";
import { BiCloudUpload, BiTrash, BiImage, BiX, BiCheck } from "react-icons/bi";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import type { UserProps } from "../../../../types/UserTypes";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import {
  generateSlug,
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";

interface BannerUploadProps {
  user: UserProps | null;
}

export default function BannerUpload({ user }: BannerUploadProps) {
  const { getAuthUser } = useOutletContext<DashboardOutletContextProps>();
  const [banner, setBanner] = useState(
    user?.banner?.[0]
      ? `${import.meta.env.VITE_MEDIA_URL}/${user?.banner?.[0]}`
      : ""
  );

  const [srcToCrop, setSrcToCrop] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState(
    `${generateSlug(user?.username || "")}-banner.png`
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setBanner(
      user?.banner?.[0]
        ? `${import.meta.env.VITE_MEDIA_URL}/${user?.banner?.[0]}`
        : ""
    );
  }, [user?.banner]);

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
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

  const uploadBanner = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("banner", file);
      const res = await API.patch(`/user/banner/${user?._id}`, formData);
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
      setBanner(croppedDataUrl);

      const croppedFile = await canvasToFile(canvas, originalFileName);

      await uploadBanner(croppedFile);
      setSrcToCrop(null);
    } catch (err) {
      console.error("Banner upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };
  const handleCancelCrop = () => {
    setSrcToCrop(null);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/user/banner/${user?._id}`);
      getSuccessResponse(response);
      getAuthUser()
    } catch (error) {
      getErrorResponse(error, true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-semibold text-gray-900">
          Cover Photo
        </label>
        <span className="text-xs text-gray-400">Ratio 2:1</span>
      </div>

      {/* --- PREVIEW CONTAINER --- */}
      <div className="relative w-full aspect-[2/1] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-4 group">
        {banner ? (
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <BiImage className="w-12 h-12 mb-2" />
            <span className="text-sm text-gray-400">No cover photo</span>
          </div>
        )}
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex flex-row items-center gap-3 mt-auto">
        <button
          onClick={triggerInput}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <BiCloudUpload size={18} />
          Upload
        </button>
        {banner && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-white border border-gray-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
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

      {/* --- CROPPER MODAL OVERLAY --- */}
      {srcToCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Crop Cover Photo
              </h3>
              <button
                onClick={handleCancelCrop}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
                  aspectRatio: 2 / 1,
                  grid: true,
                }}
                backgroundClassName="bg-gray-900"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={handleCancelCrop} disabled={isUploading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                disabled={isUploading}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm"
              >
                <BiCheck size={18} />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
