import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BiTimeFive,
  BiBarChartAlt,
  BiGroup,
  BiTargetLock,
  BiListCheck,
  BiGift,
  BiInfoCircle,
  BiCategory,
} from "react-icons/bi";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { Breadcrumbs } from "../../../ui/breadcrumbs/Breadcrumbs";
import ReadMoreLess from "../../../ui/read-more/ReadMoreLess";
import type { TaskProps } from "../../../types/AcademicStructureType";

export default function TaskView() {
  const { objectId } = useParams();
  const [task, setTask] = useState<TaskProps | null>(null);
  const [loading, setLoading] = useState(true);

  const getTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/task/${objectId}`);
      setTask(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    getTaskDetails();
  }, [getTaskDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-125 flex-col gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-purple-600 font-medium animate-pulse">
          Loading Task Details...
        </p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-gray-500">
        <h2 className="text-xl font-bold">Task not found</h2>
        <Link
          to="/dashboard/tasks"
          className="text-purple-600 hover:underline mt-2"
        >
          Return to Task List
        </Link>
      </div>
    );
  }

  const groupName =
    typeof task.academic_group_id === "object"
      ? task.academic_group_id?.academic_group
      : "Group ID: " + task.academic_group_id;

  const difficultyName =
    typeof task.difficulty_level === "object"
      ? task.difficulty_level?.category_name
      : task.difficulty_level;

  // Extract Task Type Name safely
  const taskTypeName =
    task.task_type && typeof task.task_type === "object"
      ? task.task_type?.category_name
      : null;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        title="View Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tasks", path: "/dashboard/tasks" },
          { label: "Details" },
        ]}
      />

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Academic Group */}
            <span className="inline-flex capitalize items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              <BiGroup size={14} /> {groupName}
            </span>

            {/* Task Type (Pillar) */}
            {taskTypeName && (
              <span className="inline-flex capitalize items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                <BiCategory size={14} /> {taskTypeName}
              </span>
            )}

            {/* Difficulty */}
            <span className="inline-flex capitalize items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
              <BiBarChartAlt size={14} /> {difficultyName}
            </span>

            {/* Duration */}
            <span className="inline-flex capitalize items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
              <BiTimeFive size={14} /> {task.duration?.duration_value}{" "}
              {task.duration?.duration_type}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {task.title}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
            <BiTargetLock size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Task Objective</h2>
        </div>
        <div className="p-8">
          <ReadMoreLess children={task?.objective} limit={100} />
        </div>
      </div>

      {task.important_details && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
              <BiInfoCircle size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Important Details & Guidelines
            </h2>
          </div>
          <div className="p-8">
            <ReadMoreLess children={task?.important_details} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
            <BiListCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Steps to Implement
          </h2>
        </div>
        <div className="p-8">
          <ReadMoreLess children={task?.steps_to_implement} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
            <BiGift size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Final Deliverable</h2>
        </div>
        <div className="p-8">
          <ReadMoreLess children={task?.final_deliverable} />
        </div>
      </div>
    </div>
  );
}