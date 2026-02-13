import { useCallback, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { BiTask, BiTimeFive, BiLinkExternal, BiEnvelope } from "react-icons/bi";
import { API } from "../../contexts/API";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import Badge from "../../ui/badge/Badge";
import { SubmissionModal } from "./student_compoents/task_components/SubmissionHistoryModal";
import SubmissionHistory from "./student_compoents/task_components/SubmissionHistory";
import SubmittedWorkView, {
  type SubmissionData,
} from "./student_compoents/task_components/SubmittedWorkView";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
  maskSensitive,
} from "../../contexts/Callbacks";
import type { TaskProps } from "../../types/AcademicStructureType";
import { TaskDetailsModal } from "./student_compoents/task_components/TaskDetailModal";
import type { DashboardOutletContextProps } from "../../types/Types";
import VerdirdictForm from "./student_compoents/task_components/VerdirdictForm";
import StudentTaskReviewSkeleton from "../../ui/loading/pages/StudentTaskViewSkeleton";

interface StudentInfo {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: any[];
  student_id_number?: string;
}

export default function StudentTaskReview() {
  const { userId, taskId } = useParams();
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [task, setTask] = useState<TaskProps | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<SubmissionData | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const fetchData = useCallback(async () => {
    startLoadingBar();
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
      stopLoadingBar();
    }
  }, [userId, taskId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <StudentTaskReviewSkeleton />;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom flex items-center gap-4 relative group">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-4 p-2 text-(--text-color) hover:text-(--main) rounded-full transition-all"
            title="View Public Profile"
          >
            <BiLinkExternal size={20} />
          </a>
          <div className="w-16 h-16 rounded-full bg-(--main) shadow-custom overflow-hidden shrink-0">
            <img
              src={getUserAvatar(student.avatar || [])}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 pr-8">
            <h4>{student.name}</h4>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-(--text-color) truncate">
                <BiEnvelope /> {maskSensitive(student.email)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom flex flex-col justify-center gap-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-(--main) uppercase tracking-wider flex items-center gap-1">
                <BiTask /> Task Details
              </span>
              <button
                onClick={() => setShowTaskDetails(true)}
                className=" text-(--text-color) hover:text-(--main)"
                title="View Full Task Details"
              >
                <BiLinkExternal size={18} />
              </button>
            </div>

            <h4>{task.title}</h4>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                children={
                  typeof task.difficulty_level === "object"
                    ? task.difficulty_level?.category_name
                    : task.difficulty_level
                }
              />
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
        <div className="lg:col-span-2 space-y-8">
          <div>
            {latestSubmission ? (
              <SubmittedWorkView submission={latestSubmission} />
            ) : (
              <div className="bg-(--primary-bg) rounded-custom shadow-custom p-12 text-center">
                <div className="w-16 h-16 bg-(--secondary-bg) text-(--text-color) rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiTimeFive size={32} />
                </div>
                <h3 className="text-lg font-bold text-(--text-color-emphasis)">
                  No Submissions Yet
                </h3>
                <p className="text-(--text-color) text-sm mt-1">
                  The student has not submitted any work for this task yet.
                </p>
              </div>
            )}
          </div>

          <VerdirdictForm
            isApproved={isApproved}
            isRejected={isRejected}
            fetchData={fetchData}
            latestSubmission={latestSubmission}
            task={task}
          />
        </div>

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
