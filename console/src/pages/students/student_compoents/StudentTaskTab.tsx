import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BiPlus,
  BiTask,
  BiTimeFive,
  BiDotsHorizontalRounded,
} from "react-icons/bi";
import {
  getErrorResponse,
  getStatusColor,
  stripHtml,
} from "../../../contexts/Callbacks";
import type { TaskProps } from "../../../types/AcademicStructureType";
import { API } from "../../../contexts/API";
import Badge from "../../../ui/badge/Badge";

interface AssignedTaskEntry {
  task_id: string | { _id: string };
  status: string;
  _id: string;
}

interface MergedTask extends TaskProps {
  status: string;
  assignment_id: string;
}

export default function StudentTaskTab() {
  const { objectId } = useParams(); // Student ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<MergedTask[]>([]);

  const fetchData = useCallback(async () => {
    if (!objectId) return;
    try {
      setLoading(true);
      const [allTasksRes, assignedRes] = await Promise.all([
        API.get("/task/all"),
        API.get(`/user/task/${objectId}`),
      ]);

      const allTasks: TaskProps[] =
        allTasksRes.data?.tasks || allTasksRes.data || [];
      const assignmentData =
        assignedRes.data?.assignment || assignedRes.data || {};
      const assignedEntries: AssignedTaskEntry[] = assignmentData.tasks || [];

      // Map assigned tasks
      const assignmentMap = new Map<string, { status: string; id: string }>();

      assignedEntries.forEach((entry) => {
        const tId =
          typeof entry.task_id === "object" ? entry.task_id._id : entry.task_id;
        if (tId) {
          assignmentMap.set(tId, {
            status: entry.status.toLowerCase(),
            id: entry._id,
          });
        }
      });

      // Filter and Merge
      const merged: MergedTask[] = allTasks
        .filter((t) => assignmentMap.has(t._id))
        .map((t) => {
          const details = assignmentMap.get(t._id)!;
          return {
            ...t,
            status: details.status,
            assignment_id: details.id,
          };
        });

      setMyTasks(merged);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Assigned Tasks</h3>
          <p className="text-sm text-gray-500">
            Manage and track tasks assigned to this student.
          </p>
        </div>
        <button
          onClick={() =>
            navigate(`/dashboard/student/${objectId}/tasks/assign`)
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-md shadow-purple-200 transition-all"
        >
          <BiPlus size={20} />
          Assign New Task
        </button>
      </div>

      {/* Task List */}
      {myTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <BiTask size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Tasks Assigned</h3>
          <p className="text-gray-500 text-sm mt-1">
            This student has not been assigned any tasks yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myTasks.map((task) => (
            <div
              key={task._id}
              className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <Link
                      to={`/dashboard/student/${objectId}/tasks/${task._id}`}
                      className="text-base font-bold text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors"
                    >
                      {task.title}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2.5em]">
                      {stripHtml(task.objective, 100)}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Badge
                      children={task?.status}
                      variant={getStatusColor(task.status)}
                    />
                  </div>
                </div>

                {/* Footer / Meta */}
                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <BiTimeFive />
                      {task.duration
                        ? `${task.duration.duration_value} ${task.duration.duration_type}`
                        : "N/A"}
                    </div>
                    {typeof task.difficulty_level === "object" && (
                      <span className="capitalize">
                        {task.difficulty_level?.category_name}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/dashboard/task/${task._id}`}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <BiDotsHorizontalRounded size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
