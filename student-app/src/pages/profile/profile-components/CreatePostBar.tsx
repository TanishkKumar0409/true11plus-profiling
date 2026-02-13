import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuImage, LuX, LuTrash2 } from "react-icons/lu";
import { API } from "../../../contexts/API";
import {
  getErrorResponse,
  getSuccessResponse,
  getUserAvatar,
} from "../../../contexts/CallBacks";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";

interface SelectedImage {
  id: string;
  url: string;
  file: File;
}

const CreatePostBar = ({ getPosts }: { getPosts: () => void }) => {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Image Selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: SelectedImage[] = Array.from(e.target.files).map(
        (file) => ({
          id: Math.random().toString(36).substr(2, 9),
          url: URL.createObjectURL(file),
          file: file,
        }),
      );
      setSelectedImages((prevImages) => prevImages.concat(filesArray));
      setIsExpanded(true);
    }
  };

  // Remove Image
  const removeImage = (id: string) => {
    setSelectedImages((prevImages) => {
      const filtered = prevImages.filter((img) => img.id !== id);
      // Optional: Revoke URL to free memory
      const target = prevImages.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return filtered;
    });
  };

  // Submit Post
  const handlePost = async () => {
    try {
      startLoadingBar();
      setLoading(true);
      const formData = new FormData();
      formData.append("text", postContent);

      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const response = await API.post("/user/create/post", formData);

      getSuccessResponse(response);
      getPosts();
      // Clean up URLs
      selectedImages.forEach((img) => URL.revokeObjectURL(img.url));

      setPostContent("");
      setSelectedImages([]);
      setIsExpanded(false);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  };

  return (
    <div className="flex justify-center">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full bg-(--primary-bg) overflow-hidden h-fit shadow-custom rounded-custom border border-(--gray-subtle)"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 flex items-center gap-3"
            >
              <img
                src={getUserAvatar(authUser?.avatar || [])}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-(--main-subtle)"
              />
              <button
                onClick={() => setIsExpanded(true)}
                className="flex-1 text-left px-5 py-2.5 border border-(--gray-subtle) hover:bg-(--gray-subtle) transition-all font-medium rounded-full text-(--gray)"
              >
                Start a post...
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-(--gray) hover:text-(--main) hover:bg-(--main-subtle) rounded-custom transition-colors"
              >
                <LuImage size={22} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-(--gray-subtle)">
                <div className="flex items-center gap-3">
                  <img
                    src={getUserAvatar(authUser?.avatar || [])}
                    className="w-10 h-10 rounded-full border-2 border-(--main-subtle)"
                    alt="User"
                  />
                  <h4 className="font-bold text-sm">Tanishk Kumar</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-(--gray) hover:text-(--danger) hover:bg-(--danger-subtle) transition-colors rounded-full"
                >
                  <LuX size={20} />
                </button>
              </div>

              <div className="px-4 py-4 max-h-112 overflow-y-auto custom-scrollbar">
                <textarea
                  autoFocus
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What do you want to talk about?"
                  className="w-full min-h-30 outline-none resize-none placeholder-(--gray) text-(--gray-emphasis) bg-transparent"
                />

                {selectedImages.length > 0 && (
                  <div
                    className={`grid gap-2 mt-4 ${selectedImages.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}
                  >
                    <AnimatePresence>
                      {selectedImages.map((image) => (
                        <motion.div
                          key={image.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative group aspect-4/3 rounded-xl overflow-hidden border border-(--gray-subtle)"
                        >
                          <img
                            src={image.url}
                            className="w-full h-full object-cover"
                            alt="preview"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="p-2 bg-(--danger) text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                            >
                              <LuTrash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-(--gray-subtle) flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-(--main-subtle) transition-all flex items-center gap-2 rounded-custom text-(--main)"
                >
                  <LuImage size={22} />
                  <span className="text-xs font-bold">Media</span>
                </button>

                <button
                  type="button"
                  disabled={
                    loading ||
                    (!postContent.trim() && selectedImages.length === 0)
                  }
                  onClick={handlePost}
                  className={`px-8 py-2 font-bold text-sm transition-all shadow-custom rounded-full ${
                    postContent.trim() || selectedImages.length > 0
                      ? "bg-(--main) text-white hover:bg-(--main-emphasis) active:scale-95"
                      : "bg-(--main-subtle) text-(--main) cursor-not-allowed"
                  }`}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CreatePostBar;
