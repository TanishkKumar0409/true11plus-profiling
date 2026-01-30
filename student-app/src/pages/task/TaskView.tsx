import { useCallback, useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  BiTargetLock,
  BiListCheck,
  BiGift,
  BiInfoCircle,
  BiPlay,
  BiPause,
  BiCheckCircle,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { getErrorResponse } from "../../contexts/CallBacks";
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

interface AssignedTaskEntry {
  task_id: string | { _id: string };
  status: string;
  _id: string;
}

export default function TaskView() {
  const { objectId } = useParams();
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const [task, setTask] = useState<TaskProps | null>(null);
  const [assignmentStatus, setAssignmentStatus] = useState<string>("assign");
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<SubmissionData | null>(null);

  const fetchData = useCallback(async () => {
    if (!objectId || !authUser?._id) return;

    try {
      setLoading(true);
      const [taskRes, assignedRes] = await Promise.all([
        API.get(`/task/${objectId}`),
        API.get(`/user/task/${authUser._id}`),
      ]);

      setTask(taskRes.data);

      // 1. Get Status from Assigned List
      const assignmentData =
        assignedRes.data?.assignment || assignedRes.data || {};
      const assignedTasks: AssignedTaskEntry[] = assignmentData.tasks || [];

      const currentAssignment = assignedTasks.find((entry) => {
        const tId =
          typeof entry.task_id === "object" ? entry.task_id._id : entry.task_id;
        return tId === objectId;
      });

      if (currentAssignment) {
        const status = currentAssignment.status.toLowerCase();
        setAssignmentStatus(status);

        // 2. Fetch history if user has interacted with task (anything other than 'assign')
        if (status !== "assign") {
          try {
            const subRes = await API.get(`/user/task/submission/${objectId}`);
            const subData = Array.isArray(subRes.data)
              ? subRes.data
              : subRes.data?.submissions || [];
            setSubmissions(subData);
          } catch (subError) {
            console.log("No submissions found yet.");
          }
        }
      }
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [objectId, authUser?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Actions (Start / Hold) ---
  const updateStatus = async (newStatus: string) => {
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
    }
  };

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

  if (!task) return null;

  // --- Logic Helpers ---
  const isAssign = assignmentStatus === "assign";
  const isStarted = assignmentStatus === "started";
  const isHold = assignmentStatus === "hold";
  const isRejected = assignmentStatus === "rejected";
  const isApproved = assignmentStatus === "approved";
  const isSubmitted = assignmentStatus === "submitted";

  // Show Form ONLY if Started or Rejected
  const showForm = isStarted || isRejected;

  // Get Latest Submission for display (Submitted/Approved states)
  const latestSubmission =
    submissions.length > 0
      ? [...submissions].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : null;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- MAIN CONTENT (Left Column) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
            <div className="relative z-10">
              <span className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-2 block">
                Task Title
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {task.title}
              </h1>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                <BiTargetLock size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Objective</h2>
            </div>
            <div className="p-8">
              <ReadMoreLess children={task?.objective} limit={150} />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                <BiListCheck size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Steps</h2>
            </div>
            <div className="p-8 text-gray-600">
              <ReadMoreLess children={task?.steps_to_implement} />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                <BiGift size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Deliverable</h2>
            </div>
            <div className="p-8 text-gray-600">
              <ReadMoreLess children={task?.final_deliverable} />
            </div>
          </div>

          {task.important_details && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                  <BiInfoCircle size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Important Details
                </h2>
              </div>
              <div className="p-8 text-gray-600">
                <ReadMoreLess children={task?.important_details} />
              </div>
            </div>
          )}

          {/* --- ACTION AREA --- */}
          <div className="pt-4 border-t border-gray-100">
            {/* 1. ASSIGN STATE: Show Start Button */}
            {isAssign && (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BiPlay size={36} className="ml-1" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">
                  Ready to Start?
                </h3>
                <p className="text-blue-700 mt-2 mb-6 max-w-md mx-auto">
                  Click the button below to begin working on this task. This
                  will change the status to "Started".
                </p>
                <button
                  onClick={() => updateStatus("started")}
                  disabled={actionLoading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105"
                >
                  {actionLoading ? "Starting..." : "Start Task Now"}
                </button>
              </div>
            )}

            {/* 2. HOLD STATE: Show Resume Button Only (NO FORM) */}
            {isHold && (
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-orange-900 text-lg">
                    Task is on Hold
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    You paused this task. Click resume to continue working and
                    submit.
                  </p>
                </div>
                <button
                  onClick={() => updateStatus("started")}
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-white text-orange-600 border border-orange-200 rounded-xl font-bold hover:bg-orange-50 hover:shadow-sm transition-all"
                >
                  {actionLoading ? "Resuming..." : "Resume Task"}
                </button>
              </div>
            )}

            {/* 3. REJECTED STATE: Show Warning (Form follows below) */}
            {isRejected && (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-6">
                <h4 className="font-bold text-red-800 flex items-center gap-2">
                  <BiInfoCircle /> Submission Rejected
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Your last submission was not approved. Please review the
                  feedback in the history sidebar and submit a new version
                  below.
                </p>
              </div>
            )}

            {/* 4. SUBMITTED / APPROVED STATE: Show Latest View (Read Only) */}
            {(isSubmitted || isApproved) && latestSubmission ? (
              <div className="space-y-4">
                {isApproved && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 text-green-800">
                    <BiCheckCircle size={24} />
                    <span className="font-bold">
                      Congratulations! This task has been approved.
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-800 ml-2">
                  Latest Submission
                </h3>
                <SubmittedWorkView submission={latestSubmission} />
              </div>
            ) : null}

            {/* 5. FORM: Show ONLY if Started or Rejected */}
            {showForm && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 ml-2">
                    {isRejected ? "Resubmit Work" : "Submit Your Work"}
                  </h3>
                  {(isStarted || isRejected) && (
                    <button
                      onClick={() => updateStatus("hold")}
                      disabled={actionLoading}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors border border-orange-100"
                    >
                      <BiPause /> Put on Hold
                    </button>
                  )}
                </div>
                <TaskSubmissionForm
                  task={task}
                  student={authUser}
                  onSuccess={() => fetchData()}
                />
              </div>
            )}
          </div>
        </div>

        {/* --- SIDEBAR (Right Column) --- */}
        <div className="lg:col-span-1 space-y-6 sticky top-6">
          <TaskInfomationSidebar task={{ ...task, status: assignmentStatus }} />

          <SubmissionHistory
            submissions={submissions}
            onSelect={(sub) => setSelectedHistoryItem(sub)}
          />
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedHistoryItem && (
        <SubmissionModal
          submission={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
        />
      )}
    </div>
  );
}
