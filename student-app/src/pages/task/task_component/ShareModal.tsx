import { useState } from "react";
import type { SubmissionData } from "./SubmittedWorkView";
import { API } from "../../../contexts/API";
import toast from "react-hot-toast";
import { getErrorResponse } from "../../../contexts/CallBacks";
import { createPortal } from "react-dom";
import { BiX } from "react-icons/bi";
import { TextareaGroup } from "../../../ui/form/FormComponents";
import { ButtonGroup, SecondButton } from "../../../ui/buttons/Button";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";

export const ActivityShareModal = ({
  submission,
  onClose,
}: {
  submission: SubmissionData;
  onClose: () => void;
}) => {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [message, setMessage] = useState(
    "I successfully completed this task! Check out my work. 🚀",
  );
  const [sharing, setSharing] = useState(false);
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "";

  const handleShare = async () => {
    startLoadingBar();
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
      stopLoadingBar();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="mobile-overlay backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-100 w-full max-w-2xl bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h4>Share Achievement</h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-(--text-color) hover:text-(--main) hover:bg-(--secondary-bg) transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <TextareaGroup
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Say Something about this"
            placeholder="Write a caption..."
          />

          {/* Image Preview */}
          {submission.images && submission.images.length > 0 && (
            <div>
              <p className="block text-xs text-(--text-color) mb-1">
                Attached Images
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {submission.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 shrink-0 rounded-custom overflow-hidden shadow-custom"
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
        <div className="px-6 py-4 flex justify-end gap-3">
          <SecondButton onClick={onClose} label={"Cancel"} />
          <ButtonGroup
            onClick={handleShare}
            disable={sharing}
            label={sharing ? "Sharing...." : "Share Now"}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
