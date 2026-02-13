import { createPortal } from "react-dom";
import type { TaskProps } from "../../../../types/AcademicStructureType";
import { BiX } from "react-icons/bi";
import ReadMoreLess from "../../../../ui/read-more/ReadMoreLess";

export const TaskDetailsModal = ({
  task,
  onClose,
}: {
  task: TaskProps;
  onClose: () => void;
}) => {
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-(--primary-bg) rounded-custom shadow-custom custom-scrollbar flex flex-col">
        <div className="sticky top-0 z-10 px-6 py-2  bg-(--primary-bg) border-b border-(--border) flex items-center justify-between">
          <h4>Task Details</h4>
          <button
            onClick={onClose}
            className="p-2 bg-(--danger-subtle) hover:bg-(--danger) hover:text-(--danger-subtle) text-(--danger) rounded-full transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-(--text-color) uppercase tracking-wider mb-1">
              Title
            </h4>
            <p className="text-lg font-bold text-(--text-color)">
              {task.title}
            </p>
          </div>
          <section
            className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
          >
            <div
              className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
            >
              <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                Objective
              </h2>
            </div>
            <ReadMoreLess children={task?.objective} limit={150} />
          </section>
          <section
            className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
          >
            <div
              className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
            >
              <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                Steps
              </h2>
            </div>
            <ReadMoreLess children={task?.steps_to_implement} limit={150} />
          </section>
          <section
            className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
          >
            <div
              className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
            >
              <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                Deliverable
              </h2>
            </div>
            <ReadMoreLess children={task?.final_deliverable} limit={150} />
          </section>
          <section
            className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
          >
            <div
              className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
            >
              <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                Important Details
              </h2>
            </div>
            <ReadMoreLess children={task?.important_details} limit={150} />
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
};
