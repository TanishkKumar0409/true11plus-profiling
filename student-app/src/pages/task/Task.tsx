import { useCallback, useEffect, useState, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  BiCheckCircle,
  BiTask,
  BiDotsHorizontalRounded,
  BiCalendar,
  BiColumns,
  BiListUl,
  BiLoader,
  BiRevision,
  BiPaperPlane,
} from "react-icons/bi";
import { API } from "../../contexts/API";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import {
  getErrorResponse,
  getStatusColor,
  stripHtml,
} from "../../contexts/CallBacks";
import type { DashboardOutletContextProps } from "../../types/Types";
import Badge from "../../ui/badge/Badge";
import type { TaskProps } from "../../types/AcademicStructureType";
import TaskProgresses from "./task_component/TaskProgresses";

interface AssignedTaskEntry {
  task_id: string;
  status: string;
  _id: string;
}

interface MergedTask extends TaskProps {
  status: string;
  assignment_id: string;
}

// --- Status Categorization Logic ---
const COLUMN_CONFIG = [
  {
    id: "todo",
    label: "To Do",
    icon: BiTask,
    color: "bg-gray-50 text-gray-600",
    statuses: ["assign"],
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: BiLoader,
    color: "bg-blue-50 text-blue-600",
    statuses: ["started", "rejected", "hold"],
  },
  {
    id: "review",
    label: "Under Review",
    icon: BiPaperPlane,
    color: "bg-purple-50 text-purple-600",
    statuses: ["submitted", "pending"],
  },
  {
    id: "done",
    label: "Completed",
    icon: BiCheckCircle,
    color: "bg-green-50 text-green-600",
    statuses: ["approved", "completed"],
  },
];

export default function StudentTaskView() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<MergedTask[]>([]);

  // 1. Default to Board View
  const [viewMode, setViewMode] = useState<"list" | "board">("board");

  const fetchData = useCallback(async () => {
    if (!authUser?._id) return;
    try {
      setLoading(true);
      const [allTasksRes, assignedRes] = await Promise.all([
        API.get("/task/all"),
        API.get(`/user/task/${authUser?._id}`),
      ]);

      const allTasks: TaskProps[] =
        allTasksRes.data?.tasks || allTasksRes.data || [];
      const assignmentData =
        assignedRes.data?.assignment || assignedRes.data || {};
      const assignedEntries: AssignedTaskEntry[] = assignmentData.tasks || [];

      const assignmentMap = new Map<string, { status: string; id: string }>();

      assignedEntries.forEach((entry) => {
        const tId = entry.task_id;
        if (tId) {
          assignmentMap.set(tId, {
            status: entry.status.toLowerCase(),
            id: entry._id,
          });
        }
      });

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
  }, [authUser?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedTasks = myTasks.filter((t) => ["approved"].includes(t.status));

  // --- Logic to Filter and Sort Columns ---
  const visibleColumns = useMemo(() => {
    return (
      COLUMN_CONFIG.map((col) => ({
        ...col,
        tasks: myTasks.filter((t) => col.statuses.includes(t.status)),
      }))
        // 2. Hide columns with 0 data
        .filter((col) => col.tasks.length > 0)
    );
    // Optional: Sort by task count descending if you want strictly "most data first"
    // .sort((a, b) => b.tasks.length - a.tasks.length);
  }, [myTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <Breadcrumbs
        title="My Tasks"
        breadcrumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Tasks",  },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* --- MAIN CONTENT AREA --- */}
        <div className="lg:col-span-3 space-y-6">
          {/* View Toggle Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                {viewMode === "list" ? <BiListUl /> : <BiColumns />}
              </div>
              {viewMode === "list" ? "Task List" : "Task Board"}
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  viewMode === "board"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <BiColumns size={18} /> Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <BiListUl size={18} /> List
              </button>
            </div>
          </div>

          {/* --- VIEW: LIST --- */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {myTasks.length === 0 ? (
                <EmptyState />
              ) : (
                myTasks.map((task) => (
                  <TaskCardList key={task._id} task={task} />
                ))
              )}
            </div>
          )}

          {viewMode === "board" && (
            <div className="w-full h-full min-h-150 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {visibleColumns.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-1 overflow-x-auto h-full">
                  {visibleColumns.map((col) => (
                    <div
                      key={col.id}
                      className="flex-1 min-w-70 flex flex-col border-r border-gray-200 last:border-r-0 animate-fade-in-up"
                    >
                      {/* Header - Calendar Style */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg ${col.color.split(" ")[0]} bg-opacity-70`}
                          >
                            <col.icon
                              className={col.color.split(" ")[1]}
                              size={16}
                            />
                          </div>
                          <span className="font-bold text-gray-700 text-sm">
                            {col.label}
                          </span>
                        </div>
                        <span className="bg-white px-2.5 py-0.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
                          {col.tasks.length}
                        </span>
                      </div>

                      {/* Content Area - Full Height */}
                      <div className="flex-1 bg-white p-3 space-y-3 overflow-y-auto max-h-200 custom-scrollbar">
                        {col.tasks.map((task) => (
                          <TaskCardBoard key={task._id} task={task} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="space-y-8 lg:sticky lg:top-6">
          <TaskProgresses myTasks={myTasks} />

          {/* Completed Widget */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                <BiCheckCircle />
              </div>
              Completed ({completedTasks.length})
            </div>

            <div className="space-y-4 max-h-75 overflow-y-auto custom-scrollbar pr-1">
              {completedTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No completed tasks yet.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <BiCheckCircle size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {stripHtml(task.objective, 50)}
                      </p>
                      <span className="text-[10px] text-green-600 font-medium mt-1 inline-block uppercase">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-sm w-full">
      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <BiCheckCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
      <p className="text-gray-500 mt-2">You have no active tasks. Great job!</p>
    </div>
  );
}

// List View Card
function TaskCardList({ task }: { task: MergedTask }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Link
            to={`/task/${task._id}`}
            className="text-lg font-bold text-gray-900 leading-tight hover:text-purple-600 transition-colors"
          >
            {task.title}
          </Link>
          <button className="text-gray-400 hover:text-purple-600 transition-colors">
            <BiDotsHorizontalRounded size={24} />
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {stripHtml(task.objective, 120)}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <BiCalendar className="text-gray-400" size={16} />
            {task.duration
              ? `${task.duration.duration_value} ${task.duration.duration_type}`
              : "No Deadline"}
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-2">
          <Badge children={task.status} variant={getStatusColor(task.status)} />
          <Link
            to={`/task/${task._id}`}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// Board View Card (Compact)
function TaskCardBoard({ task }: { task: MergedTask }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all group animate-fade-in-up">
      <div className="flex justify-between items-start gap-2 mb-2">
        <Badge
          children={task.status}
          variant={getStatusColor(task.status)}
          className="text-[10px] px-1.5 py-0.5"
        />
        {task.status === "rejected" && (
          <BiRevision className="text-red-500" title="Needs Revision" />
        )}
      </div>
      <Link
        to={`/task/${task._id}`}
        className="block font-bold text-gray-800 text-sm leading-snug hover:text-purple-600 mb-2"
      >
        {task.title}
      </Link>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
        {stripHtml(task.objective, 60)}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2">
        <div className="flex items-center gap-1">
          <BiCalendar />
          {task.duration
            ? `${task.duration.duration_value}${task.duration.duration_type.charAt(0)}`
            : "-"}
        </div>
        <Link
          to={`/task/${task._id}`}
          className="text-gray-400 hover:text-purple-600"
        >
          <BiDotsHorizontalRounded size={16} />
        </Link>
      </div>
    </div>
  );
}
