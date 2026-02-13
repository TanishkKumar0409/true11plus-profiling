import { createPortal } from "react-dom";
import type { SubmissionData } from "./SubmittedWorkView";
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
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-(--primary-bg) rounded-custom shadow-custom animate-fade-in-up custom-scrollbar">
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
