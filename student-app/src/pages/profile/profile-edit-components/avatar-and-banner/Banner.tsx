import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUpload, BiEditAlt, BiTrash, BiX } from "react-icons/bi";
import {
  Cropper,
  type CropperRef,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useOutletContext } from "react-router-dom";
import type { UserProps } from "../../../../types/UserTypes";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { API } from "../../../../contexts/API";
import {
  generateSlug,
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { ButtonGroup, SecondButton } from "../../../../ui/buttons/Button";

interface BannerUploadProps {
  user: UserProps | null;
}

export default function BannerUpload({ user }: BannerUploadProps) {
  const { getAuthUser } = useOutletContext<DashboardOutletContextProps>();
  const [banner, setBanner] = useState(
    user?.banner?.[0]
      ? `${import.meta.env.VITE_MEDIA_URL}/${user?.banner?.[0]}`
      : "",
  );

  const [srcToCrop, setSrcToCrop] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    setBanner(
      user?.banner?.[0]
        ? `${import.meta.env.VITE_MEDIA_URL}/${user?.banner?.[0]}`
        : "",
    );
    if (!originalFileName && user?.username) {
      setOriginalFileName(`${generateSlug(user.username)}-banner.png`);
    }
  }, [user?.banner, user?.username, originalFileName]);

  useEffect(() => {
    if (srcToCrop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [srcToCrop]);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrcToCrop(url);
    setOriginalFileName(file.name);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const canvasToFile = (canvas: HTMLCanvasElement, fileName: string) => {
    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Blob creation failed"));
          resolve(new File([blob], fileName, { type: "image/png" }));
        },
        "image/png",
        0.95,
      );
    });
  };

  const handleSaveCrop = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    try {
      setIsUploading(true);
      const croppedFile = await canvasToFile(canvas, originalFileName);
      const formData = new FormData();
      formData.append("banner", croppedFile);

      const res = await API.patch(`/user/banner/${user?._id}`, formData);
      getSuccessResponse(res);

      setBanner(canvas.toDataURL("image/png"));
      setSrcToCrop(null);
      getAuthUser();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/user/banner/${user?._id}`);
      getSuccessResponse(response);
      setBanner("");
      getAuthUser();
    } catch (error) {
      getErrorResponse(error, true);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative h-48 md:h-64 group transition-all duration-300 bg-(--gray-subtle) rounded-custom overflow-hidden ${
          dragActive
            ? "opacity-70 scale-[0.99] ring-2 ring-(--main)"
            : "opacity-100"
        }`}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {banner ? (
          <>
            <img
              src={banner}
              className="w-full h-full object-cover"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end gap-3 p-4">
              <button
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-(--main-subtle) text-(--main) hover:scale-110 transition rounded-custom shadow-lg"
              >
                <BiEditAlt size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-(--danger) text-white hover:scale-110 transition rounded-custom shadow-lg"
              >
                <BiTrash size={20} />
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-(--main) hover:bg-black/5 cursor-pointer transition-colors"
          >
            <BiUpload size={40} className="mb-2 opacity-50" />
            <p className="font-bold">Upload Cover Banner</p>
            <p className="text-xs opacity-60">Recommended Ratio 2:1</p>
          </div>
        )}
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
        />
      </div>

      <AnimatePresence>
        {srcToCrop && (
          <div className="fixed inset-0 z-1000 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-(--primary-bg) overflow-hidden max-w-2xl w-full rounded-custom shadow-custom flex flex-col"
            >
              <div className="px-6 py-4 flex justify-between items-center border-b border-(--gray-subtle)">
                <div>
                  <h4 className="font-bold text-(--text-color) leading-tight">
                    Edit Cover Photo
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider font-semibold opacity-50">
                    Adjust and Crop
                  </p>
                </div>
                <button
                  onClick={() => setSrcToCrop(null)}
                  className="p-1 hover:bg-(--main-subtle) rounded-custom transition-all text-(--text-subtle) hover:text-(--main)"
                >
                  <BiX size={26} />
                </button>
              </div>

              <div className="relative w-full aspect-square md:aspect-video max-h-112.5 bg-black flex items-center justify-center overflow-hidden">
                <Cropper
                  ref={cropperRef}
                  src={srcToCrop}
                  stencilComponent={RectangleStencil}
                  stencilProps={{
                    aspectRatio: 2 / 1,
                    grid: true,
                  }}
                  className="w-full h-full"
                />
              </div>

              <div className="py-4 px-6 bg-(--primary-bg) flex flex-col sm:flex-row gap-4 justify-end items-center border-t border-(--gray-subtle)">
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="flex-1">
                    <SecondButton
                      label="Cancel"
                      onClick={() => setSrcToCrop(null)}
                      className="w-full justify-center"
                    />
                  </div>
                  <ButtonGroup
                    onClick={handleSaveCrop}
                    label={isUploading ? "Uploading..." : "Save Changes"}
                    disable={isUploading}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
