import { useCallback, useEffect, useState } from "react";
import { useParams, useOutletContext, Navigate } from "react-router-dom";
import { BiInfoCircle, BiCheckCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import { getErrorResponse, getStatusColor } from "../../contexts/CallBacks";
import { API } from "../../contexts/API";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import ReadMoreLess from "../../ui/read-more/ReadMoreLess";
import type { TaskProps } from "../../types/AcademicStructureType";
import type { DashboardOutletContextProps } from "../../types/Types";
import TaskSubmissionForm from "./task_component/TaskSubmissionForm";
import SubmittedWorkView, {
  type SubmissionData,
} from "./task_component/SubmittedWorkView";
import SubmissionHistory from "./task_component/SubmissionHistory";
import TaskInfomationSidebar from "./task_component/TaskInfomationSidebar";
import { SubmissionModal } from "./task_component/SubmissionHistoryModal";
import Badge from "../../ui/badge/Badge";
import TaskStart from "./task_component/TaskStart";
import { motion } from "framer-motion";
import TaskViewSkeleton from "../../ui/loading/pages/TaskViewSkeleton";

interface AssignedTaskEntry {
  task_id: string | { _id: string };
  status: string;
  assign_date: string; // Ensure this is in the interface
  _id: string;
}

export default function TaskView() {
  const { objectId } = useParams();
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [task, setTask] = useState<TaskProps | null>(null);
  const [assignmentStatus, setAssignmentStatus] = useState<string>("assign");
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<SubmissionData | null>(null);

  const fetchData = useCallback(async () => {
    startLoadingBar();
    if (!objectId || !authUser?._id) return;

    try {
      setLoading(true);
      const [taskRes, assignedRes] = await Promise.all([
        API.get(`/task/${objectId}`),
        API.get(`/user/task/${authUser._id}`),
      ]);

      const assignmentData =
        assignedRes.data?.assignment || assignedRes.data || {};
      const assignedTasks: AssignedTaskEntry[] = assignmentData.tasks || [];

      const currentAssignment = assignedTasks.find((entry) => {
        const tId =
          typeof entry.task_id === "object" ? entry.task_id._id : entry.task_id;
        return tId === objectId;
      });

      // Merge assign_date into the task object before setting state
      const taskWithAssignmentData = {
        ...taskRes.data,
        assign_date: currentAssignment?.assign_date || null,
      };

      setTask(taskWithAssignmentData);

      if (currentAssignment) {
        const status = currentAssignment.status.toLowerCase();
        setAssignmentStatus(status);

        if (status !== "assign") {
          try {
            const subRes = await API.get(`/user/task/submission/${objectId}`);
            const subData = Array.isArray(subRes.data)
              ? subRes.data
              : subRes.data?.submissions || [];
            setSubmissions(subData);
          } catch (subError) {
            console.log("No submissions found yet.", subError);
          }
        }
      }
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [objectId, authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (newStatus: string) => {
    startLoadingBar();
    try {
      setActionLoading(true);
      const payload = {
        user_id: authUser?._id,
        task_id: objectId,
        status: newStatus,
      };
      await API.patch("/user/task/update/status", payload);
      toast.success(
        newStatus === "started" ? "Task Started" : "Task put on Hold",
      );
      setAssignmentStatus(newStatus);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setActionLoading(false);
      stopLoadingBar();
    }
  };

  const isAssign = assignmentStatus === "assign";
  const isStarted = assignmentStatus === "started";
  const isHold = assignmentStatus === "hold";
  const isRejected = assignmentStatus === "rejected";
  const isApproved = assignmentStatus === "approved";
  const isSubmitted = assignmentStatus === "submitted";

  const showForm = isStarted || isRejected;

  const latestSubmission =
    submissions.length > 0
      ? [...submissions].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : null;

  if (loading) return <TaskViewSkeleton />;

  if (!task) return <Navigate to="/task" replace />;

  return (
    <div className="space-y-6 pb-10">
      <Breadcrumbs
        title="View Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Tasks", path: "/task" },
          { label: task?.title || "Details" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <header className="relative bg-(--primary-bg) p-10 shadow-custom rounded-custom overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Badge
                dot
                children={task?.status}
                variant={getStatusColor(task?.status || "")}
              />
            </div>
            <h1 className="text-6xl font-black mt-6 tracking-tighter text-(--text-color-emphasis) leading-tight uppercase drop-shadow-sm">
              {task?.title}
            </h1>
          </header>

          <div className="grid gap-8">
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
              <ReadMoreLess children={task?.objective || ""} limit={150} />
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
              <ReadMoreLess
                children={task?.steps_to_implement || ""}
                limit={150}
              />
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
              <ReadMoreLess
                children={task?.final_deliverable || ""}
                limit={150}
              />
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
              <ReadMoreLess
                children={task?.important_details || ""}
                limit={150}
              />
            </section>
          </div>

          <div>
            {isAssign && (
              <TaskStart
                onStart={() => updateStatus("started")}
                loading={actionLoading}
              />
            )}

            {isHold && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-(--warning) p-10 text-center text-(--white) shadow-custom rounded-custom"
              >
                <BiInfoCircle size={60} className="mx-auto mb-3" />
                <h1 className="font-bold mb-2">Task is on Hold!</h1>
                <p className="font-bold text-(--warning-subtle)! uppercase tracking-widest text-xs">
                  You paused this task. Click resume to continue working and
                  submit.
                </p>
                <button
                  onClick={() => updateStatus("started")}
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-(--warning-subtle) mt-4 text-(--warning-emphasis) rounded-custom shadow-sm transition-all"
                >
                  {actionLoading ? "Resuming..." : "Resume Task"}
                </button>
              </motion.div>
            )}

            {isRejected && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-(--danger) p-10 mb-10 text-center text-(--white) shadow-custom rounded-custom"
              >
                <BiInfoCircle size={60} className="mx-auto mb-3" />
                <h1 className="font-bold mb-2">Submission Rejected!</h1>
                <p className="font-bold text-(--danger-subtle)! uppercase tracking-widest text-xs">
                  Your last submission was not approved. Please review the
                  feedback in the history sidebar and submit a new version
                  below.
                </p>
              </motion.div>
            )}

            {(isSubmitted || isApproved) && latestSubmission && (
              <div className="space-y-4">
                {isApproved && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-(--success) p-10 text-center text-(--white) shadow-custom rounded-custom"
                  >
                    <BiCheckCircle size={60} className="mx-auto mb-3" />
                    <h1 className="font-bold mb-2">Work Submitted!</h1>
                    <p className="font-bold text-(--success-subtle)! uppercase tracking-widest text-xs">
                      Post Your Task
                    </p>
                  </motion.div>
                )}
                <SubmittedWorkView submission={latestSubmission} />
              </div>
            )}

            {showForm && (
              <TaskSubmissionForm
                task={task}
                student={authUser}
                statusUpdate={() => updateStatus("hold")}
                actionLoading={actionLoading}
                onSuccess={() => fetchData()}
              />
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-20 space-y-3">
            <TaskInfomationSidebar
              task={{ ...task, status: assignmentStatus }}
            />
            <SubmissionHistory
              submissions={submissions}
              onSelect={(sub) => setSelectedHistoryItem(sub)}
            />
          </div>
        </aside>
      </div>

      {selectedHistoryItem && (
        <SubmissionModal
          submission={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
        />
      )}
    </div>
  );
}