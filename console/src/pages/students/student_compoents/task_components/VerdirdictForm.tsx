import { useState } from "react";
import { BiCheckCircle, BiXCircle, BiArrowBack, BiSend } from "react-icons/bi";
import { getErrorResponse } from "../../../../contexts/Callbacks";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { API } from "../../../../contexts/API";
import { useOutletContext, useParams } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import type { TaskProps } from "../../../../types/AcademicStructureType";
import type { SubmissionData } from "./SubmittedWorkView";
import { ButtonGroup } from "../../../../ui/button/Button";
import { motion } from "framer-motion";

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

export default function VerdirdictForm({
  isApproved,
  isRejected,
  task,
  fetchData,
  latestSubmission,
}: {
  isApproved: boolean;
  isRejected: boolean;
  task: TaskProps;
  fetchData: () => void;
  latestSubmission: SubmissionData | null;
}) {
  const { userId } = useParams();
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [selectedVerdict, setSelectedVerdict] = useState<
    "approved" | "rejected" | null
  >(null);
  const [verdictRemark, setVerdictRemark] = useState("");
  const [verdictGrade, setVerdictGrade] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedVerdict) return;

    if (selectedVerdict === "approved") {
      if (!verdictGrade) return toast.error("Please select a grade.");
      if (!verdictRemark.trim())
        return toast.error("Please provide a remark for approval.");
    }

    if (selectedVerdict === "rejected" && !verdictRemark.trim()) {
      return toast.error("Please provide a reason for rejection.");
    }

    const result = await Swal.fire({
      title: `Confirm ${selectedVerdict === "approved" ? "Approval" : "Rejection"}?`,
      text: "This action will update the student's task status.",
      icon: selectedVerdict === "approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit Verdict",
      confirmButtonColor:
        selectedVerdict === "approved" ? "#16a34a" : "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      startLoadingBar();
      setActionLoading(true);
      const payload = {
        user_id: userId,
        task_id: task?._id,
        status: selectedVerdict,
        remark: verdictRemark,
        grade: selectedVerdict === "approved" ? verdictGrade : "",
      };

      await API.patch("/user/task/update/verdict", payload);
      toast.success(`Task successfully ${selectedVerdict}`);
      fetchData();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setActionLoading(false);
      stopLoadingBar();
    }
  };
  if (isApproved || isRejected) {
    const statusConfig = {
      title: isApproved ? "Submission Approved!" : "Submission Rejected!",
      description: isApproved
        ? "Your submission has been successfully verified. You can view the finalized details in your dashboard history."
        : "Your last submission was not approved. Please review the feedback in the history sidebar and submit a new version below.",
      themeClass: isApproved ? "bg-(--success)" : "bg-(--danger)",
      subtleText: isApproved
        ? "text-(--success-subtle)!"
        : "text-(--danger-subtle)!",
    };

    return (
      <motion.div
        key="done"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${statusConfig.themeClass} p-10 mb-10 text-center text-(--white) shadow-custom rounded-custom`}
      >
        {isApproved ? (
          <BiCheckCircle size={60} className="mx-auto mb-3" />
        ) : (
          <BiXCircle size={60} className="mx-auto mb-3" />
        )}

        <h1 className="font-bold mb-2 text-2xl">{statusConfig.title}</h1>

        <p
          className={`font-medium ${statusConfig.subtleText} uppercase tracking-widest text-xs max-w-md mx-auto`}
        >
          {statusConfig.description}
        </p>
      </motion.div>
    );
  }
  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <p className="font-bold text-(--text-color)">
          Provide final verdict for student work.
        </p>
      </div>

      <div className="p-6">
        {!selectedVerdict ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-(--text-color) mb-4">
              Select your verdict for this task:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedVerdict("approved")}
                disabled={!latestSubmission}
                className="group p-6 border-2 border-(--success) hover:bg-(--success-subtle) rounded-custom transition-all text-left disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-(--success) text-(--success-subtle) rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BiCheckCircle size={28} />
                </div>
                <h4 className="font-bold text-(--text-color-emphasis)!">
                  Approve & Grade
                </h4>
                <p className="text-xs text-(--text-color)! mt-1">
                  Accept the work and assign a performance grade.
                </p>
              </button>

              <button
                onClick={() => setSelectedVerdict("rejected")}
                disabled={!latestSubmission}
                className="group p-6 border-2 border-(--danger) hover:bg-(--danger-subtle) rounded-custom transition-all text-left disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-(--danger) text-(--danger-subtle) rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BiXCircle size={28} />
                </div>
                <h4 className="font-bold text-(--text-color-emphasis)!">
                  Reject Work
                </h4>
                <p className="text-xs text-(--text-color)! mt-1">
                  Request revisions or decline the current submission.
                </p>
              </button>
            </div>
            {!latestSubmission && (
              <p className="text-center text-xs text-(--danger)! font-bold mt-4 bg-(--danger-subtle)! py-2 rounded-custom">
                Action disabled: No submission files found to evaluate.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedVerdict(null)}
              className="flex items-center gap-1 text-xs font-bold text-(--main) mb-2"
            >
              <BiArrowBack /> Change Verdict Selection
            </button>

            <div
              className={`p-4 rounded-custom border-l-4 ${selectedVerdict === "approved" ? "bg-(--succes-subtle) border-(--success)" : "bg-(--danger-subtle) border-(--danger)"}`}
            >
              <p className="text-sm font-bold text-(--text-color)">
                Mode:{" "}
                {selectedVerdict === "approved"
                  ? "Task Approval"
                  : "Task Rejection"}
              </p>
            </div>

            {selectedVerdict === "approved" && (
              <div>
                <label className="block text-xs text-(--text-color) mb-1">
                  Assign Grade
                </label>
                <select
                  value={verdictGrade}
                  onChange={(e) => setVerdictGrade(e.target.value)}
                  className="w-full paragraph px-4 py-1.5 border border-(--border) rounded-custom focus:ring-1 focus:ring-(--border) focus:outline-none text-(--text-color-emphasis) bg-transparent font-semibold"
                >
                  <option value="">-- Choose a Grade --</option>
                  {GRADE_SCALE.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.value} ({g.range}%) — {g.label.split("(")[1]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs text-(--text-color) mb-1">
                {selectedVerdict === "approved"
                  ? "Positive Feedback"
                  : "Reason for Rejection"}
              </label>
              <textarea
                value={verdictRemark}
                onChange={(e) => setVerdictRemark(e.target.value)}
                placeholder={
                  selectedVerdict === "approved"
                    ? "Explain why this work met requirements..."
                    : "Clearly explain what needs to be fixed..."
                }
                rows={5}
                className="w-full paragraph px-4 py-2 border border-(--border) rounded-custom focus:ring-1 focus:ring-(--border) focus:outline-none bg-transparent resize-none text-(--text-color-emphasis) font-semibold"
              />
            </div>
            <ButtonGroup
              Icon={BiSend}
              onClick={handleSubmit}
              disable={actionLoading}
              className="w-full py-4!"
              label={actionLoading ? "Processing..." : "Submit Final Verdict"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
