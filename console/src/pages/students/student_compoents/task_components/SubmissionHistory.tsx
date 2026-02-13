import { useMemo } from "react";
import {
  BiHistory,
  BiChevronRight,
  BiTime,
  BiCheck,
  BiX,
} from "react-icons/bi";
import { format } from "date-fns";
import type { SubmissionData } from "./SubmittedWorkView";

interface SubmissionHistoryProps {
  submissions: SubmissionData[];
  onSelect: (submission: SubmissionData) => void;
}

export default function SubmissionHistory({
  submissions,
  onSelect,
}: SubmissionHistoryProps) {
  const sorted = useMemo(() => {
    return [...submissions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [submissions]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return <BiCheck className="text-(--success)" />;
      case "rejected":
        return <BiX className="text-(--danger)" />;
      default:
        return <BiTime className="text-(--warning)" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-(--success-subtle) border-(--success)";
      case "rejected":
        return "bg-(--danger-subtle) border-(--danger)";
      default:
        return "bg-(--warning-subtle) border-(--warning)";
    }
  };

  if (submissions.length <= 0) return null;

  return (
    <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-(--border)">
        <div className="flex items-center gap-2">
          <BiHistory className="text-(--main)" size={18} />
          <h4 className="font-bold uppercase">Submission History</h4>
        </div>
      </div>
      <div className="p-2">
        {sorted.map((sub, index) => {
          const isLatest = index === 0;
          return (
            <button
              key={sub._id}
              onClick={() => onSelect(sub)}
              className="w-full text-left p-3 rounded-custom hover:bg-(--secondary-bg) transition-colors flex items-center gap-3 group mb-1 last:mb-0"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${getStatusClass(sub.status)}`}
              >
                {getStatusIcon(sub.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-(--text-color)">
                      {isLatest
                        ? "Latest Attempt"
                        : `Attempt #${sorted.length - index}`}
                    </p>

                    {sub.grade && (
                      <span className="px-1.5 py-0.5 rounded bg-(--success-subtle) border border-(--success) text-[10px] font-bold text-(--success) leading-none">
                        {sub.grade}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-(--text-color)">
                    {format(new Date(sub.createdAt), "MMM d")}
                  </span>
                </div>
                <p className="text-(--text-color) truncate mt-1 capitalize">
                  {sub.status} • {format(new Date(sub.createdAt), "p")}
                </p>
              </div>

              <BiChevronRight className="text-(--text-color) group-hover:text-(--main) transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
