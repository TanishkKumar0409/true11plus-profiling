
import type { TaskProps } from "../../../types/AcademicStructureType";
import Badge from "../../../ui/badge/Badge";
import { getStatusColor } from "../../../contexts/CallBacks";
import { BiBarChartAlt, BiCategory, BiGroup, BiHash, BiTimeFive } from "react-icons/bi";

export default function TaskInfomationSidebar({ task }: { task: TaskProps }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Task Information</h3>
        <p className="text-sm text-gray-500">Key details and meta info</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase">
            Status
          </span>
          <Badge
            children={task?.status}
            variant={getStatusColor(task?.status)}
          />
        </div>

        {/* Meta Data List */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BiGroup size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Academic Group
              </p>
              <p className="font-semibold text-gray-900 capitalize">
                {typeof task.academic_group_id === "object"
                  ? task.academic_group_id?.academic_group
                  : "Group"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BiCategory size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Task Type
              </p>
              <p className="font-semibold text-gray-900 capitalize">
                {typeof task.task_type === "object"
                  ? task.task_type?.category_name
                  : "Group"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <BiBarChartAlt size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Difficulty Level
              </p>
              <p className="font-semibold text-gray-900 capitalize">
                {typeof task.difficulty_level === "object"
                  ? task.difficulty_level?.category_name
                  : "Group"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BiTimeFive size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Est. Duration
              </p>
              <p className="font-semibold text-gray-900">
                {task.duration?.duration_value} {task.duration?.duration_type}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pt-4 border-t border-gray-50">
            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
              <BiHash size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Task ID
              </p>
              <p className="font-mono text-xs text-gray-500 truncate w-full">
                {task._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
