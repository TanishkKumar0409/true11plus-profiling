import {
  BiFile,
  BiImage,
  BiMessageDetail,
  BiCalendar,
  BiDownload,
  BiCheckCircle,
  BiMedal,
  BiCommentCheck,
  BiInfoCircle,
} from "react-icons/bi";
import { formatDate, getStatusColor } from "../../../contexts/Callbacks";
import Badge from "../../../ui/badge/Badge";

// --- Types ---
interface FileEntry {
  filePath: string;
  fileName: string;
  _id: string;
}

interface ImageEntry {
  original: string;
  compressed: string;
  _id: string;
}

export interface SubmissionData {
  _id: string;
  student_id: string;
  task_id: string;
  message: string;
  files: FileEntry[];
  images: ImageEntry[];
  createdAt: string;
  status: string;
  grade?: string;
  remark?: string;
}

interface SubmittedWorkViewProps {
  submission: SubmissionData;
  title?: string;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <BiFile className="text-red-500" size={24} />;
  if (["doc", "docx"].includes(ext || ""))
    return <BiFile className="text-blue-500" size={24} />;
  if (["xls", "xlsx", "csv"].includes(ext || ""))
    return <BiFile className="text-green-500" size={24} />;
  if (["ppt", "pptx"].includes(ext || ""))
    return <BiFile className="text-orange-500" size={24} />;
  return <BiFile className="text-gray-500" size={24} />;
};

export default function SubmittedWorkView({
  submission,
  title = "Submission Details",
}: SubmittedWorkViewProps) {
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "";

  // Helper to determine feedback styling based on status
  const status = submission?.status?.toLowerCase();
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const showFeedback =
    (isApproved || isRejected) && (submission?.grade || submission?.remark);

  // Dynamic Theme Colors
  const theme = isRejected
    ? {
        bg: "from-red-50 to-orange-50/30",
        border: "border-red-100",
        textMain: "text-red-800",
        textSub: "text-red-700",
        textLabel: "text-red-600",
        cardBg: "bg-white/60",
        cardBorder: "border-red-100",
        decor: "bg-red-200",
        icon: <BiInfoCircle size={18} />,
        label: "Reason for Rejection",
      }
    : {
        bg: "from-green-50 to-emerald-50/30",
        border: "border-green-100",
        textMain: "text-green-800",
        textSub: "text-green-700",
        textLabel: "text-green-600",
        cardBg: "bg-white/60",
        cardBorder: "border-green-100",
        decor: "bg-green-200",
        icon: <BiMedal size={18} />,
        label: "Mentor Assessment",
      };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600 border border-gray-100">
            <BiCheckCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 font-medium">
              Submitted on {formatDate(submission?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            children={submission?.status}
            variant={getStatusColor(submission?.status)}
          />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <BiCalendar size={14} />
            {formatDate(submission?.createdAt)}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">

        {showFeedback && (
          <div
            className={`bg-linear-to-br ${theme.bg} rounded-2xl p-6 border ${theme.border} relative overflow-hidden`}
          >
            {/* Decor Blob */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${theme.decor} rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2`}
            ></div>

            <h4
              className={`text-sm font-bold ${theme.textMain} uppercase tracking-wide mb-4 flex items-center gap-2`}
            >
              {theme.icon} {theme.label}
            </h4>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Grade Box (Only show if Approved & Graded) */}
              {submission.grade && (
                <div
                  className={`bg-white/80 backdrop-blur-sm p-4 rounded-xl border ${theme.cardBorder} shadow-sm min-w-30 text-center`}
                >
                  <span
                    className={`block text-xs font-bold ${theme.textLabel} uppercase mb-1`}
                  >
                    Grade Achieved
                  </span>
                  <span
                    className={`block text-3xl font-extrabold ${theme.textSub}`}
                  >
                    {submission.grade}
                  </span>
                </div>
              )}

              {/* Remark Box */}
              {submission.remark && (
                <div className="flex-1">
                  <div
                    className={`${theme.cardBg} backdrop-blur-sm p-4 rounded-xl border ${theme.cardBorder} h-full`}
                  >
                    <span
                      className={`flex items-center gap-2 text-xs font-bold ${theme.textSub} mb-2`}
                    >
                      <BiCommentCheck size={16} /> Mentor Remarks
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {submission.remark}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STUDENT SUBMISSION CONTENT --- */}

        {/* Message */}
        {submission?.message && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BiMessageDetail className="text-gray-400" />
              Student Notes
            </h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed italic relative">
              <span className="absolute top-2 left-2 text-3xl text-gray-200 font-serif -z-10">
                “
              </span>
              {submission?.message}
            </div>
          </div>
        )}

        {/* Files */}
        {submission?.files && submission?.files?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BiFile className="text-gray-400" />
              Attached Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {submission.files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:border-purple-200 transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      {getFileIcon(file.fileName)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium text-gray-700 truncate"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase">
                        {file.fileName.split(".").pop()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${MEDIA_URL}${file.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <BiDownload size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {submission.images && submission.images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BiImage className="text-gray-400" />
              Gallery
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {submission.images.map((img, idx) => (
                <a
                  key={img._id || idx}
                  href={`${MEDIA_URL}${img.original}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="block relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                >
                  <img
                    src={`${MEDIA_URL}${img.compressed || img.original}`}
                    alt="Submission"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                    <span className="p-2 bg-white/90 rounded-full text-gray-900 shadow-lg">
                      <BiDownload size={20} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
