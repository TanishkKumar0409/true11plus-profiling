import { createPortal } from "react-dom";
import type { SubmissionData } from "./SubmittedWorkView";
import { BiX } from "react-icons/bi";
import SubmittedWorkView from "./SubmittedWorkView";

export const SubmissionModal = ({
  submission,
  onClose,
}: {
  submission: SubmissionData;
  onClose: () => void;
}) => {
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-fade-in-up custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10"
        >
          <BiX size={24} />
        </button>
        <div className="p-1">
          <SubmittedWorkView
            submission={submission}
            title="Submission Attempt"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
