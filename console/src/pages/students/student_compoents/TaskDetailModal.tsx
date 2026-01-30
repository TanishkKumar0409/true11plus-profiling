import { createPortal } from "react-dom";
import type { TaskProps } from "../../../types/AcademicStructureType";
import {
  BiGift,
  BiInfoCircle,
  BiListCheck,
  BiTargetLock,
  BiTask,
  BiX,
} from "react-icons/bi";
import ReadMoreLess from "../../../ui/read-more/ReadMoreLess";

export const TaskDetailsModal = ({
  task,
  onClose,
}: {
  task: TaskProps;
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-fade-in-up custom-scrollbar flex flex-col">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BiTask className="text-purple-600" />
            Task Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
              Title
            </h4>
            <p className="text-lg font-bold text-gray-900">{task.title}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
              <BiTargetLock className="text-purple-600" /> Objective
            </h4>
            <div className="text-sm text-gray-600">
              <ReadMoreLess children={task.objective} limit={200} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
              <BiListCheck className="text-purple-600" /> Steps
            </h4>
            <div className="text-sm text-gray-600">
              <ReadMoreLess children={task.steps_to_implement} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
              <BiGift className="text-purple-600" /> Deliverable
            </h4>
            <div className="text-sm text-gray-600 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
              <ReadMoreLess children={task.final_deliverable} />
            </div>
          </div>

          {task.important_details && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                <BiInfoCircle className="text-purple-600" /> Important Info
              </h4>
              <div className="text-sm text-gray-600">
                <ReadMoreLess children={task.important_details} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
