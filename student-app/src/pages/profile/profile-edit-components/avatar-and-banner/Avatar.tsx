import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUpload, BiEditAlt, BiTrash, BiX, BiUser } from "react-icons/bi";
import {
  Cropper,
  type CropperRef,
  CircleStencil,
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

interface AvatarUploadProps {
  user: UserProps | null;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const { getAuthUser } = useOutletContext<DashboardOutletContextProps>();
  const [avatar, setAvatar] = useState(
    user?.avatar?.[0]
      ? `${import.meta.env.VITE_MEDIA_URL}/${user?.avatar?.[0]}`
      : "",
  );

  const [srcToCrop, setSrcToCrop] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    setAvatar(
      user?.avatar?.[0]
        ? `${import.meta.env.VITE_MEDIA_URL}/${user?.avatar?.[0]}`
        : "",
    );
    if (!originalFileName && user?.username) {
      setOriginalFileName(`${generateSlug(user.username)}-avatar.png`);
    }
  }, [user?.avatar, user?.username, originalFileName]);

  // Handle Body Scroll Lock
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
      formData.append("avatar", croppedFile);

      const res = await API.patch(`/user/avatar/${user?._id}`, formData);
      getSuccessResponse(res);

      setAvatar(canvas.toDataURL("image/png"));
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
      const response = await API.delete(`/user/avatar/${user?._id}`);
      getSuccessResponse(response);
      setAvatar("");
      getAuthUser();
    } catch (error) {
      getErrorResponse(error, true);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center sm:items-start">
        <div className="relative group">
          {/* Avatar Preview Circle */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-(--gray-subtle) flex items-center justify-center transition-all duration-300">
            {avatar ? (
              <img
                src={avatar}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            ) : (
              <BiUser className="w-16 h-16 text-(--main) opacity-30" />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white text-gray-800 rounded-full hover:scale-110 transition shadow-lg"
                title="Update Photo"
              >
                <BiUpload size={18} />
              </button>
              {avatar && (
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition shadow-lg"
                  title="Remove Photo"
                >
                  <BiTrash size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Floating Edit Badge (Desktop) */}
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-1 right-1 p-2 bg-(--main) text-white rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform sm:flex hidden"
          >
            <BiEditAlt size={16} />
          </button>
        </div>

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

      {/* --- CROPPER MODAL --- */}
      <AnimatePresence>
        {srcToCrop && (
          <div className="fixed inset-0 z-1000 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-(--primary-bg) overflow-hidden max-w-2xl w-full rounded-custom shadow-custom flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-(--gray-subtle)">
                <div>
                  <h4 className="font-bold text-(--text-color) leading-tight">
                    Edit Profile Photo
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

              {/* Cropper Body */}
              <div className="relative w-full aspect-square max-h-112.5 bg-black flex items-center justify-center overflow-hidden">
                <Cropper
                  ref={cropperRef}
                  src={srcToCrop}
                  stencilComponent={CircleStencil}
                  stencilProps={{
                    aspectRatio: 1 / 1,
                    grid: true,
                  }}
                  className="w-full h-full"
                />
              </div>

              {/* Footer Actions */}
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
