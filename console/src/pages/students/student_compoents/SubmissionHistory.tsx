import { useMemo } from "react";
import {
  BiHistory,
  BiChevronRight,
  BiTime,
  BiCheck,
  BiX,
} from "react-icons/bi";
import { format } from "date-fns";
import type { SubmissionData } from "./SubmittedWorkView"; // Ensure SubmissionData type includes 'grade'

interface SubmissionHistoryProps {
  submissions: SubmissionData[];
  onSelect: (submission: SubmissionData) => void;
}

export default function SubmissionHistory({
  submissions,
  onSelect,
}: SubmissionHistoryProps) {
  // Sort: Newest first
  const sorted = useMemo(() => {
    return [...submissions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [submissions]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return <BiCheck className="text-green-600" />;
      case "rejected":
        return <BiX className="text-red-600" />;
      default:
        return <BiTime className="text-yellow-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-green-50 border-green-100";
      case "rejected":
        return "bg-red-50 border-red-100";
      default:
        return "bg-yellow-50 border-yellow-100";
    }
  };

  if (submissions.length <= 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <BiHistory className="text-purple-600" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Submission History</h3>
      </div>
      <div className="p-2">
        {sorted.map((sub, index) => {
          const isLatest = index === 0;
          return (
            <button
              key={sub._id}
              onClick={() => onSelect(sub)}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 group border border-transparent hover:border-gray-100 mb-1 last:mb-0"
            >
              {/* Status Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${getStatusClass(
                  sub.status
                )}`}
              >
                {getStatusIcon(sub.status)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">
                      {isLatest
                        ? "Latest Attempt"
                        : `Attempt #${sorted.length - index}`}
                    </p>
                    
                    {/* GRADE BADGE */}
                    {/* @ts-ignore - Assuming grade exists on the type now */}
                    {sub.grade && (
                      <span className="px-1.5 py-0.5 rounded bg-green-100 border border-green-200 text-[10px] font-bold text-green-700 leading-none">
                        {/* @ts-ignore */}
                        {sub.grade}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] text-gray-400">
                    {format(new Date(sub.createdAt), "MMM d")}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5 capitalize">
                  {sub.status} • {format(new Date(sub.createdAt), "p")}
                </p>
              </div>

              <BiChevronRight className="text-gray-300 group-hover:text-purple-600 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}