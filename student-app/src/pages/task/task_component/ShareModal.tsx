import { useState } from "react";
import type { SubmissionData } from "./SubmittedWorkView";
import { API } from "../../../contexts/API";
import toast from "react-hot-toast";
import { getErrorResponse } from "../../../contexts/CallBacks";
import { createPortal } from "react-dom";
import { BiLoaderAlt, BiShareAlt, BiX } from "react-icons/bi";

export const ActivityShareModal = ({
  submission,
  onClose,
}: {
  submission: SubmissionData;
  onClose: () => void;
}) => {
  const [message, setMessage] = useState(
    "I successfully completed this task! Check out my work. 🚀",
  );
  const [sharing, setSharing] = useState(false);
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "";

  const handleShare = async () => {
    try {
      setSharing(true);
      const payload = {
        task_id: submission.task_id,
        submission_id: submission._id,
        message,
        post_type: "task",
      };

      await API.post("/user/task/submission/post", payload);
      toast.success("Successfully shared to activity feed!");
      onClose();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setSharing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BiShareAlt className="text-purple-600" /> Share Achievement
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Text Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Say something about this
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 p-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none text-sm text-gray-700 placeholder-gray-400 transition-all"
              placeholder="Write a caption..."
            />
          </div>

          {/* Image Preview */}
          {submission.images && submission.images.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                Attached Images
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {submission.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={`${MEDIA_URL}${img.compressed}`}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {sharing ? (
              <>
                <BiLoaderAlt className="animate-spin" /> Sharing...
              </>
            ) : (
              <>
                <BiShareAlt /> Share Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
