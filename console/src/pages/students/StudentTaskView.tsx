import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BiTask,
  BiCheckCircle,
  BiXCircle,
  BiTimeFive,
  BiLinkExternal,
  BiEnvelope,
  BiIdCard,
  BiMedal,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { API } from "../../contexts/API";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import Badge from "../../ui/badge/Badge";
import { SubmissionModal } from "./student_compoents/SubmissionHistoryModal";
import SubmissionHistory from "./student_compoents/SubmissionHistory";
import SubmittedWorkView, {
  type SubmissionData,
} from "./student_compoents/SubmittedWorkView";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
} from "../../contexts/Callbacks";
import type { TaskProps } from "../../types/AcademicStructureType";
import { TaskDetailsModal } from "./student_compoents/TaskDetailModal";

// --- Types ---
interface StudentInfo {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: any[];
  student_id_number?: string;
}

const GRADE_SCALE = [
  { label: "A++ (Outstanding)", range: "91-100", value: "A++" },
  { label: "A+ (Excellent)", range: "81-90", value: "A+" },
  { label: "A (Very Good)", range: "71-80", value: "A" },
  { label: "B++ (Good)", range: "61-70", value: "B++" },
  { label: "B+ (Above Average)", range: "51-60", value: "B+" },
  { label: "B (Average)", range: "41-50", value: "B" },
  { label: "C++ (Below Average)", range: "31-40", value: "C++" },
  { label: "C+ (Poor)", range: "21-30", value: "C+" },
  { label: "C (Very Poor)", range: "11-20", value: "C" },
  { label: "D (Fail)", range: "0-10", value: "D" },
];

export default function StudentTaskReview() {
  const { userId, taskId } = useParams();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [task, setTask] = useState<TaskProps | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);

  // Form State
  const [verdictRemark, setVerdictRemark] = useState("");
  const [verdictGrade, setVerdictGrade] = useState("");

  // Modals
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<SubmissionData | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId || !taskId) return;

    try {
      setLoading(true);

      const results = await Promise.allSettled([
        API.get(`/user/${userId}`),
        API.get(`/task/${taskId}`),
        API.get(`/user/task/${userId}`),
        API.get(`/user/task/submission/${taskId}`),
      ]);

      const [studentRes, taskRes, assignRes, submissionRes] = results;

      // ---- Student ----
      if (studentRes.status === "fulfilled") {
        setStudent(studentRes.value.data?.user || studentRes.value.data);
      }

      let taskData = null;
      if (taskRes.status === "fulfilled") {
        taskData = taskRes.value.data;
      }

      if (
        assignRes.status === "fulfilled" &&
        taskData &&
        Array.isArray(assignRes.value?.data?.tasks)
      ) {
        const matchedTask = assignRes.value.data.tasks.find(
          (item: any) => String(item.task_id) === String(taskData._id),
        );
        if (matchedTask) {
          setTask({
            ...taskData,
            status: matchedTask.status,
          });
        }
      } else if (taskData) {
        setTask(taskData);
      }

      // ---- Submissions ----
      if (submissionRes.status === "fulfilled") {
        const subData = Array.isArray(submissionRes.value.data)
          ? submissionRes.value.data
          : submissionRes.value.data?.submissions || [];

        setSubmissions(
          subData.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      }
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setLoading(false);
    }
  }, [userId, taskId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handle Verdict ---
  const handleVerdict = async (verdict: "approved" | "rejected") => {
    // Validation
    if (verdict === "approved" && !verdictGrade && !verdictRemark.trim()) {
      toast.error("Please select a grade to approve.");
      return;
    }
    if (verdict === "rejected" && !verdictRemark.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    const result = await Swal.fire({
      title: `Confirm ${verdict === "approved" ? "Approval" : "Rejection"}?`,
      text: "This action will update the student's task status.",
      icon: verdict === "approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${verdict}`,
      confirmButtonColor: verdict === "approved" ? "#16a34a" : "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(true);
      const payload = {
        user_id: userId,
        task_id: taskId,
        status: verdict,
        remark: verdictRemark,
        grade: verdictGrade,
      };

      await API.patch("/user/task/update/verdict", payload);

      toast.success(`Task successfully ${verdict}`);
      fetchData(); // Refresh data
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student || !task) return <div>Data not found</div>;

  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const isApproved = task.status?.toLowerCase() === "approved";
  const isRejected = task.status?.toLowerCase() === "rejected";
  const profileUrl = `${import.meta.env.VITE_STUDENT_APP_URL}/profile/${student.username}`;

  return (
    <div className="space-y-6 pb-10">
      <Breadcrumbs
        title="Review Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Students", path: "/dashboard/students" },
          { label: student.name, path: `/dashboard/student/${userId}` },
          { label: "Task Review" },
        ]}
      />

      {/* --- HEADER CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 relative group">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            title="View Public Profile"
          >
            <BiLinkExternal size={20} />
          </a>
          <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
            <img
              src={getUserAvatar(student.avatar || [])}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 pr-8">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {student.name}
            </h3>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                <BiEnvelope /> {student.email}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                <BiIdCard /> {student.student_id_number || "ID: N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Task Info (Summary) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center gap-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <BiTask /> Task Details
              </span>
              <button
                onClick={() => setShowTaskDetails(true)}
                className="text-gray-400 hover:text-purple-600 transition-colors"
                title="View Full Task Details"
              >
                <BiLinkExternal size={18} />
              </button>
            </div>

            <h3
              className="text-lg font-bold text-gray-900 line-clamp-1"
              title={task.title}
            >
              {task.title}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                children={
                  typeof task.difficulty_level === "object"
                    ? task.difficulty_level?.category_name
                    : task.difficulty_level
                }
              />
              <div className="h-4 w-px bg-gray-300 mx-1"></div>
              <Badge
                children={task?.status}
                variant={getStatusColor(task?.status)}
                className="capitalize"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- MAIN CONTENT COLUMN (2/3) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. STUDENT SUBMISSION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Submitted Work
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {submissions.length} Attempt(s)
              </span>
            </div>

            {latestSubmission ? (
              <SubmittedWorkView submission={latestSubmission} />
            ) : (
              <div className="bg-gray-50 border-2 border-gray-200 border-dashed rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiTimeFive size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-600">
                  No Submissions Yet
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  The student has not submitted any work for this task yet.
                </p>
              </div>
            )}
          </div>

          {/* 2. MENTOR ASSESSMENT FORM (Directly Below Work) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BiMedal className="text-purple-600" /> Assessment & Verdict
                </h3>
                <p className="text-sm text-gray-500">
                  Grade the work and provide feedback.
                </p>
              </div>
              {/* Show Status Badge if already graded */}
              {(isApproved || isRejected) && (
                <Badge
                  children={task.status}
                  variant={getStatusColor(task.status)}
                  className="uppercase text-sm px-3 py-1"
                />
              )}
            </div>

            {/* If Task is Pending or Submitted (Not Finalized), show form */}
            {!isApproved && !isRejected ? (
              <div className="p-6 space-y-6">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Grade{" "}
                    <span className="text-gray-400 font-normal">
                      (Required for Approval)
                    </span>
                  </label>
                  <select
                    value={verdictGrade}
                    onChange={(e) => setVerdictGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                  >
                    <option value="">-- Choose a Grade --</option>
                    {GRADE_SCALE.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.value} &nbsp; — &nbsp; {g.range}% &nbsp; (
                        {g.label.split("(")[1]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Feedback / Remarks{" "}
                    <span className="text-gray-400 font-normal">
                      (Required for Rejection)
                    </span>
                  </label>
                  <textarea
                    value={verdictRemark}
                    onChange={(e) => setVerdictRemark(e.target.value)}
                    placeholder="Provide constructive feedback for the student..."
                    className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => handleVerdict("approved")}
                    disabled={actionLoading || !latestSubmission}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all"
                  >
                    <BiCheckCircle size={20} />
                    Approve Task
                  </button>

                  <button
                    onClick={() => handleVerdict("rejected")}
                    disabled={actionLoading || !latestSubmission}
                    className="flex-1 py-3 px-4 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <BiXCircle size={20} />
                    Reject
                  </button>
                </div>
                {!latestSubmission && (
                  <p className="text-center text-xs text-red-400">
                    Cannot grade a task with no submissions.
                  </p>
                )}
              </div>
            ) : (
              // READ ONLY VIEW IF ALREADY GRADED
              <div className="p-8 text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    isApproved
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isApproved ? (
                    <BiCheckCircle size={40} />
                  ) : (
                    <BiXCircle size={40} />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xl font-bold ${isApproved ? "text-green-800" : "text-red-800"}`}
                  >
                    Task {isApproved ? "Approved" : "Rejected"}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    This task has been graded and finalized.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- SIDEBAR: HISTORY & NAV (1/3) --- */}
        <div className="lg:col-span-1 space-y-6 sticky top-6">
          <SubmissionHistory
            submissions={submissions}
            onSelect={(sub) => setSelectedHistoryItem(sub)}
          />
        </div>
      </div>

      {selectedHistoryItem && (
        <SubmissionModal
          submission={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
        />
      )}

      {showTaskDetails && task && (
        <TaskDetailsModal
          task={task}
          onClose={() => setShowTaskDetails(false)}
        />
      )}
    </div>
  );
}
