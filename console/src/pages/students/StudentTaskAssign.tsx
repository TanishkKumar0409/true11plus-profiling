import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
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
import type { DashboardOutletContextProps } from "../../types/Types";
import { ButtonGroup, SecondButton } from "../../ui/button/Button";
import { SelectGroup } from "../../ui/form/FormComponents";
import StudentTaskAssignSkeleton from "../../ui/loading/pages/StudentTaskAssignSkeleton";

interface AssignedTaskEntry {
  task_id: string | { _id: string };
  status: string;
  _id: string;
}

export default function StudentTaskAssign() {
  const { objectId } = useParams();
  const navigate = useNavigate();
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmissions] = useState(false);

  const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
  const [student, setStudent] = useState<UserProps | null>(null);

  const [assignedTaskMap, setAssignedTaskMap] = useState<Map<string, string>>(
    new Map(),
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTaskType, setFilterTaskType] = useState("");
  const [filterDurationType, setFilterDurationType] = useState("");

  const fetchData = useCallback(async () => {
    startLoadingBar();
    if (!objectId) return;

    try {
      setLoading(true);

      const results = await Promise.allSettled([
        API.get("/task/all"),
        API.get(`/user/${objectId}`),
        API.get(`/user/task/${objectId}`),
      ]);

      const allTasksRes =
        results[0].status === "fulfilled" ? results[0].value : null;
      const studentRes =
        results[1].status === "fulfilled" ? results[1].value : null;
      const assignedRes =
        results[2].status === "fulfilled" ? results[2].value : null;

      if (allTasksRes) {
        const tasksData = allTasksRes.data?.tasks || allTasksRes.data || [];
        const activeMasterTasks = tasksData.filter(
          (t: TaskProps) => t.status === "active",
        );
        setAllTasks(activeMasterTasks);

        if (activeMasterTasks.length > 0) {
          setSelectedTaskId(activeMasterTasks[0]._id);
        }
      }

      if (studentRes) {
        const studentData = studentRes.data?.student || studentRes.data;
        setStudent(studentData);
      }

      if (assignedRes) {
        const assignedData = assignedRes.data?.assignment || assignedRes.data;
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
      }
    } catch (error) {
      if (!allTasks.length) navigate("/dashboard/students");
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [objectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uniqueDifficulties = useMemo(() => {
    const values = allTasks.map((t) =>
      typeof t.difficulty_level === "object"
        ? t.difficulty_level?.category_name
        : t.difficulty_level,
    );
    return Array.from(new Set(values.filter(Boolean)));
  }, [allTasks]);

  const uniqueTaskTypes = useMemo(() => {
    const values = allTasks.map((t) =>
      typeof t.task_type === "object"
        ? t.task_type?.category_name
        : t.task_type,
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
        newMap.set(taskId, "assign");
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
    [allTasks, selectedTaskId],
  );

  const clearFilters = () => {
    setFilterDifficulty("");
    setFilterTaskType("");
    setFilterDurationType("");
    setSearchTerm("");
  };

  if (loading) return <StudentTaskAssignSkeleton />;

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-(--primary-bg) p-6 rounded-custom shadow-custom shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-(--main) flex items-center justify-center overflow-hidden">
            <img
              src={getUserAvatar(student?.avatar || [])}
              className="w-full h-full object-cover"
              alt={student?.name}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-(--text-color-emphasis) leading-none">
              {student?.name}
            </h2>
            <Badge
              children={`${assignedTaskMap.size} Tasks Assigned`}
              className="mt-3"
            />
          </div>
        </div>

        <div className="w-full md:w-auto">
          <ButtonGroup
            label={submitting ? "Saving...." : "Save Changes"}
            Icon={BiSave}
            onClick={handleFinalSubmit}
            disable={submitting}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="lg:w-1/3 bg-(--primary-bg) rounded-custom shadow-custom flex flex-col overflow-hidden">
          <div className="p-4 space-y-3 border-b border-(--border)">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <BiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-color)"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-(--primary-bg) border border-(--border) rounded-custom text-sm focus:outline-none focus:ring-2 focus:ring-(--main)"
                />
              </div>
              <SecondButton
                Icon={BiFilter}
                noText
                onClick={() => setShowFilters(!showFilters)}
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 gap-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <SelectGroup
                    options={uniqueDifficulties}
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                  />
                  <SelectGroup
                    options={uniqueTaskTypes}
                    value={filterTaskType}
                    onChange={(e) => setFilterTaskType(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <SelectGroup
                    options={uniqueDurationTypes}
                    value={filterDurationType}
                    onChange={(e) => setFilterDurationType(e.target.value)}
                  />
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 bg-(--danger) text-white rounded-custom"
                  >
                    <BiX size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredTasks.map((task) => {
              const isAssigned = assignedTaskMap.has(task._id);
              const status = assignedTaskMap.get(task._id);
              const isSelected = selectedTaskId === task._id;

              return (
                <button
                  key={task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                  className={`w-full text-left p-3.5 rounded-custom transition-all ${
                    isSelected ? "bg-(--main-subtle)" : "bg-(--secondary-bg)"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isAssigned ? (
                      <BiCheckCircle className="text-(--success) mt-1" />
                    ) : (
                      <BiCircle className="text-(--text-color) mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm truncate ${isSelected ? "text-(--main)" : ""}`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {status && (
                          <Badge
                            children={status}
                            dot
                            variant={getStatusColor(status)}
                          />
                        )}
                        <Badge
                          children={
                            typeof task.difficulty_level === "object"
                              ? task.difficulty_level?.category_name
                              : "Medium"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3 bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden flex flex-col">
          {selectedTask ? (
            <>
              {(() => {
                // CORRECT FIX: Define taskStatus within this scope
                const taskStatus = assignedTaskMap.get(selectedTask._id);

                return (
                  <>
                    <div className="px-6 py-4 border-b border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-(--text-color-emphasis)">
                          {selectedTask.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-(--text-color) mt-1">
                          <BiBookOpen />
                          <span className="capitalize">
                            {typeof selectedTask.task_type === "object"
                              ? selectedTask.task_type?.category_name
                              : "General Task"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-(--text-color) uppercase opacity-60">
                            {assignedTaskMap.has(selectedTask._id)
                              ? "Assigned"
                              : "Not Assigned"}
                          </span>
                          {taskStatus && (
                            <span className="text-sm font-medium text-(--main) capitalize">
                              {taskStatus}
                            </span>
                          )}
                        </div>

                        {/* Condition to hide toggle if task is already in progress */}
                        {(!taskStatus ||
                          taskStatus.toLowerCase() === "assign") && (
                          <ToggleButton
                            checked={assignedTaskMap.has(selectedTask._id)}
                            onToggle={(checked) =>
                              handleTaskToggle(selectedTask._id, checked)
                            }
                            label="Assign Task"
                          />
                        )}
                      </div>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-(--secondary-bg) p-5 rounded-custom">
                          <h4 className="text-xs font-bold uppercase opacity-60 mb-1">
                            Duration
                          </h4>
                          <p className="text-(--main) font-bold">
                            {selectedTask.duration?.duration_value}{" "}
                            {selectedTask.duration?.duration_type}
                          </p>
                        </section>
                        <section className="bg-(--secondary-bg) p-5 rounded-custom">
                          <h4 className="text-xs font-bold uppercase opacity-60 mb-1">
                            Difficulty
                          </h4>
                          <p className="text-(--main) font-bold capitalize">
                            {typeof selectedTask.difficulty_level === "object"
                              ? selectedTask.difficulty_level?.category_name
                              : "Medium"}
                          </p>
                        </section>
                      </div>

                      {[
                        { label: "Objective", content: selectedTask.objective },
                        {
                          label: "Steps To Implement",
                          content: selectedTask.steps_to_implement,
                        },
                        {
                          label: "Final Deliverable",
                          content: selectedTask.final_deliverable,
                        },
                        {
                          label: "Important Details",
                          content: selectedTask.important_details,
                        },
                      ].map((sec) => (
                        <section key={sec.label}>
                          <h4 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-(--main)" />
                            {sec.label}
                          </h4>
                          <div className="p-4 rounded-custom bg-(--secondary-bg) text-sm leading-relaxed">
                            <ReadMoreLess children={sec.content} />
                          </div>
                        </section>
                      ))}
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-(--text-color) p-8 text-center">
              <div className="w-20 h-20 bg-(--secondary-bg) rounded-full flex items-center justify-center mb-4">
                <BiTask size={40} />
              </div>
              <h3 className="text-lg font-bold">No Task Selected</h3>
              <p className="mt-2 opacity-70">
                Select a task from the sidebar to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
