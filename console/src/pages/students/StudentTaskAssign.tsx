import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BiSearch,
  BiCheckCircle,
  BiCircle,
  BiBookOpen,
  BiTask,
  BiSave,
  BiFilter,
  BiX,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { API } from "../../contexts/API";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
} from "../../contexts/Callbacks";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import ReadMoreLess from "../../ui/read-more/ReadMoreLess";
import type { UserProps } from "../../types/UserProps";
import type { TaskProps } from "../../types/AcademicStructureType";
import ToggleButton from "../../ui/button/ToggleButton";
import Badge from "../../ui/badge/Badge";

interface AssignedTaskEntry {
  task_id: string | { _id: string };
  status: string;
  _id: string;
}

export default function StudentTaskAssign() {
  const { objectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmissions] = useState(false);

  const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
  const [student, setStudent] = useState<UserProps | null>(null);

  const [assignedTaskMap, setAssignedTaskMap] = useState<Map<string, string>>(
    new Map()
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTaskType, setFilterTaskType] = useState("");
  const [filterDurationType, setFilterDurationType] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [allTasksRes, studentRes, assignedRes] = await Promise.all([
        API.get("/task/all"),
        API.get(`/user/${objectId}`),
        API.get(`/user/task/${objectId}`),
      ]);

      const tasksData = allTasksRes.data?.tasks || allTasksRes.data || [];
      const studentData = studentRes.data?.student || studentRes.data;
      const assignedData = assignedRes.data?.assignment || assignedRes.data;

      // Filter tasks to only include those with status "active" from the master list
      const activeMasterTasks = tasksData.filter(
        (t: TaskProps) => t.status === "active"
      );

      setAllTasks(activeMasterTasks);
      setStudent(studentData);

      const initialMap = new Map<string, string>();

      if (assignedData && Array.isArray(assignedData.tasks)) {
        assignedData.tasks.forEach((entry: AssignedTaskEntry) => {
          const tId =
            typeof entry.task_id === "object"
              ? entry.task_id._id
              : entry.task_id;
          if (tId) {
            initialMap.set(tId, entry.status);
          }
        });
      }
      setAssignedTaskMap(initialMap);

      if (activeMasterTasks.length > 0) {
        setSelectedTaskId(activeMasterTasks[0]._id);
      }
    } catch (error) {
      getErrorResponse(error);
      if (!allTasks.length) navigate("/dashboard/students");
    } finally {
      setLoading(false);
    }
  }, [objectId, navigate, allTasks.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uniqueDifficulties = useMemo(() => {
    const values = allTasks.map((t) =>
      typeof t.difficulty_level === "object"
        ? t.difficulty_level?.category_name
        : t.difficulty_level
    );
    return Array.from(new Set(values.filter(Boolean)));
  }, [allTasks]);

  const uniqueTaskTypes = useMemo(() => {
    const values = allTasks.map((t) =>
      typeof t.task_type === "object"
        ? t.task_type?.category_name
        : t.task_type
    );
    return Array.from(new Set(values.filter(Boolean)));
  }, [allTasks]);

  const uniqueDurationTypes = useMemo(() => {
    const values = allTasks.map((t) => t.duration?.duration_type);
    return Array.from(new Set(values.filter(Boolean)));
  }, [allTasks]);

  const handleTaskToggle = (taskId: string, isChecked: boolean) => {
    setAssignedTaskMap((prev) => {
      const newMap = new Map(prev);
      if (isChecked) {
        newMap.set(taskId, "active"); // Default status on assign
      } else {
        newMap.delete(taskId);
      }
      return newMap;
    });
  };

  const handleFinalSubmit = async () => {
    if (!student) return;
    setSubmissions(true);
    try {
      const payload = {
        user_id: student._id,
        tasks: Array.from(assignedTaskMap.keys()).map((id) => ({
          task_id: id,
        })),
      };

      const response = await API.post("/user/task/assign", payload);
      toast.success(response.data.message || "Tasks assigned successfully!");
      fetchData();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setSubmissions(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      // 1. Master Status Check (Double check, though we filtered in fetchData)
      if (t.status !== "active") return false;

      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const taskDiff =
        typeof t.difficulty_level === "object"
          ? t.difficulty_level?.category_name
          : t.difficulty_level;
      const matchesDifficulty = filterDifficulty
        ? taskDiff === filterDifficulty
        : true;

      const taskType =
        typeof t.task_type === "object"
          ? t.task_type?.category_name
          : t.task_type;
      const matchesType = filterTaskType ? taskType === filterTaskType : true;

      const matchesDuration = filterDurationType
        ? t.duration?.duration_type === filterDurationType
        : true;

      return (
        matchesSearch && matchesDifficulty && matchesType && matchesDuration
      );
    });
  }, [
    allTasks,
    searchTerm,
    filterDifficulty,
    filterTaskType,
    filterDurationType,
  ]);

  const selectedTask = useMemo(
    () => allTasks.find((t) => t._id === selectedTaskId),
    [allTasks, selectedTaskId]
  );

  const clearFilters = () => {
    setFilterDifficulty("");
    setFilterTaskType("");
    setFilterDurationType("");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 flex-col gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-purple-600 font-medium animate-pulse">
          Loading Student & Task Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col pb-6">
      <Breadcrumbs
        title="Assign Tasks"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Students", path: "/dashboard/students" },
          {
            label: student?.username || "",
            path: `/dashboard/student/${student?._id}`,
          },
          { label: "Task Allocation" },
        ]}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
              <img
                src={getUserAvatar(student?.avatar || [])}
                className="rounded-full w-full h-full object-cover"
                alt={student?.name}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">
                {student?.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span className="text-purple-600 font-medium text-xs bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {assignedTaskMap.size} Tasks Assigned
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="w-full md:w-auto px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <BiSave size={20} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <BiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-purple-50 border-purple-200 text-purple-600"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
                title="Toggle Filters"
              >
                <BiFilter size={20} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 gap-2 pt-1 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">All Difficulty</option>
                    {uniqueDifficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterTaskType}
                    onChange={(e) => setFilterTaskType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">All Types</option>
                    {uniqueTaskTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterDurationType}
                    onChange={(e) => setFilterDurationType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">All Duration Units</option>
                    {uniqueDurationTypes.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                    title="Clear Filters"
                  >
                    <BiX size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center p-4">
                <BiTask size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No active tasks match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-xs text-purple-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isAssigned = assignedTaskMap.has(task._id);
                const taskStatus = assignedTaskMap.get(task._id);
                const isSelected = selectedTaskId === task._id;

                return (
                  <button
                    key={task._id}
                    onClick={() => setSelectedTaskId(task._id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 group relative border ${
                      isSelected
                        ? "bg-purple-50 border-purple-200 shadow-sm z-10"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 shrink-0 transition-colors ${
                          isAssigned ? "text-green-500" : "text-gray-300"
                        }`}
                      >
                        {isAssigned ? (
                          <BiCheckCircle size={20} />
                        ) : (
                          <BiCircle size={20} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            className={`font-semibold text-sm truncate ${
                              isSelected ? "text-purple-900" : "text-gray-700"
                            }`}
                          >
                            {task.title}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {taskStatus && (
                            <Badge
                              children={taskStatus}
                              dot
                              variant={getStatusColor(taskStatus || "")}
                            />
                          )}
                          <Badge
                            children={
                              typeof task.difficulty_level === "object"
                                ? task.difficulty_level?.category_name
                                : "Medium"
                            }
                          />
                          <Badge
                            children={`${task?.duration?.duration_value} ${task?.duration?.duration_type}`}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {selectedTask ? (
            <>
              <div className="px-6 py-2 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center capitalize gap-2 text-sm text-gray-500 mt-1">
                    <BiBookOpen />
                    <span>
                      {typeof selectedTask.task_type === "object"
                        ? selectedTask.task_type?.category_name
                        : "General Task"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 cap">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Assigned
                    </span>
                    {assignedTaskMap.has(selectedTask._id) && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        Current Status:{" "}
                        <span className="text-purple-600 capitalize">
                          {assignedTaskMap.get(selectedTask._id)}
                        </span>
                      </span>
                    )}
                  </div>
                  <ToggleButton
                    checked={assignedTaskMap.has(selectedTask._id)}
                    onToggle={(checked) =>
                      handleTaskToggle(selectedTask._id, checked)
                    }
                    label="Assign Task"
                  />
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 capitalize">
                  <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">
                      Duration
                    </h4>
                    <p className="text-blue-900 font-medium">
                      {selectedTask.duration?.duration_value || 0}{" "}
                      {selectedTask.duration?.duration_type || "Days"}
                    </p>
                  </section>
                  <section className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                    <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-2">
                      Difficulty
                    </h4>
                    <p className="text-orange-900 font-medium">
                      {typeof selectedTask.difficulty_level === "object"
                        ? selectedTask.difficulty_level?.category_name
                        : "Standard"}
                    </p>
                  </section>
                </div>
                <section>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Objective
                  </h4>
                  <div className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    <ReadMoreLess children={selectedTask.objective} />
                  </div>
                </section>
                <section>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Steps To Implement
                  </h4>
                  <div className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    <ReadMoreLess children={selectedTask.steps_to_implement} />
                  </div>
                </section>
                <section>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Final Deliverable
                  </h4>
                  <div className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    <ReadMoreLess children={selectedTask.final_deliverable} />
                  </div>
                </section>
                <section>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Important Details
                  </h4>
                  <div className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    <ReadMoreLess children={selectedTask.important_details} />
                  </div>
                </section>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BiTask size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-600">
                No Task Selected
              </h3>
              <p className="max-w-xs mx-auto mt-2">
                Select a task from the sidebar to view details and assign it to{" "}
                <span className="font-semibold text-gray-600">
                  {student?.name}
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}