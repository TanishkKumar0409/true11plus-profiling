import { useState } from "react";
import {
  BiFile,
  BiDownload,
  BiMedal,
  BiInfoCircle,
  BiShareAlt,
  BiCheckShield,
} from "react-icons/bi";
import { formatDate, getStatusColor } from "../../../contexts/CallBacks";
import Badge from "../../../ui/badge/Badge";
import { ActivityShareModal } from "./ShareModal";

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
  updatedAt: string;
  status: string;
  grade?: string;
  remark?: string;
  is_posted: boolean;
}

interface SubmittedWorkViewProps {
  submission: SubmissionData;
  title?: string;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <BiFile className="text-(--danger)" size={24} />;
  if (["doc", "docx"].includes(ext || ""))
    return <BiFile className="text-(--blue)" size={24} />;
  if (["xls", "xlsx", "csv"].includes(ext || ""))
    return <BiFile className="text-(--success)" size={24} />;
  if (["ppt", "pptx"].includes(ext || ""))
    return <BiFile className="text-(--warning)" size={24} />;
  return <BiFile className="text-(--gray)" size={24} />;
};

export default function SubmittedWorkView({
  submission,
  title = "Submission Details",
}: SubmittedWorkViewProps) {
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "";
  const [showShareModal, setShowShareModal] = useState(false);

  const status = submission?.status?.toLowerCase();
  const isApproved = status === "approved" || status === "completed";
  const isRejected = status === "rejected";
  const isFinalized = isApproved || isRejected;

  const showFeedback =
    (isApproved || isRejected) && (submission?.grade || submission?.remark);

  const theme = isRejected
    ? {
        textSub: "text-red-700",
        textLabel: "text-red-600",
        icon: <BiInfoCircle size={18} />,
        label: "Reason for Rejection",
      }
    : {
        textSub: "text-green-700",
        textLabel: "text-green-600",
        decor: "bg-green-200",
        icon: <BiMedal size={18} />,
        label: "Mentor Assessment",
      };

  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-(--border) flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-(--text-color-emphasis)">
              {title}
            </h2>
            <div className="flex flex-col">
              <p className="text-xs text-(--text-color) font-medium">
                Submitted on {formatDate(submission?.createdAt)}
              </p>
              {isFinalized && (
                <p className="text-[10px] text-(--main) font-bold uppercase tracking-tight mt-0.5 flex items-center gap-1">
                  <BiCheckShield size={12} /> Verdict on {formatDate(submission?.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            children={submission?.status}
            dot
            variant={getStatusColor(submission?.status)}
          />

          {isApproved && !submission?.is_posted && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-(--main) bg-(--main-subtle) px-3 py-0.5 rounded-full border border-(--main) transition-colors"
              title="Share to Activity Feed"
            >
              <BiShareAlt size={14} /> Share
            </button>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {showFeedback && (
          <div
            className={`bg-(--secondary-bg) rounded-custom shadow-custom p-6 relative overflow-hidden`}
          >
            <h4 className="pb-3">{theme.label}</h4>

            <div className="flex flex-col md:flex-row gap-6">
              {isApproved && submission.grade && (
                <div
                  className={`p-4 rounded-custom bg-(--primary-bg) shadow-custom min-w-30 text-center`}
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

              {submission.remark && (
                <div className="flex-1">
                  <div
                    className={`p-4 rounded-custom bg-(--primary-bg) shadow-custom h-full`}
                  >
                    <span
                      className={`flex items-center gap-2 text-xs font-bold ${theme.textLabel} mb-2`}
                    >
                      Mentor Remarks
                    </span>
                    <p className="text-(--text-color)! leading-relaxed">
                      "{submission.remark}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {submission?.message && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-(--text-color) flex items-center gap-2">
              Student Notes
            </h4>
            <div className="bg-(--secondary-bg) p-4 rounded-xl text-sm text-(--text-color) leading-relaxed italic relative">
              "{submission?.message}"
            </div>
          </div>
        )}

        {submission?.files && submission?.files?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-(--text-color) flex items-center gap-2">
              Attached Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {submission.files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 rounded-custom shadow-custom bg-(--primary-bg) hover:border-(--main) transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      {getFileIcon(file.fileName)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm text-(--text-color-emphasis)! font-semibold truncate"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </p>
                      <p className="text-(--text-color)! uppercase">
                        {file.fileName.split(".").pop()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${MEDIA_URL}${file.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-2 text-(--text-color) hover:text-(--main) hover:bg-(--main-subtle) rounded-custom transition-colors"
                  >
                    <BiDownload size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {submission.images && submission.images.length > 0 && (
          <div className="space-y-3">
            <h4>Gallery</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {submission.images.map((img, idx) => (
                <a
                  key={img._id || idx}
                  href={`${MEDIA_URL}${img.original}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="block relative aspect-square rounded-custom shadow-custom overflow-hidden bg-(--secondary-bg) group"
                >
                  <img
                    src={`${MEDIA_URL}${img.compressed || img.original}`}
                    alt="Submission"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                    <span className="p-2 bg-(--white) rounded-full text-(--text-color) shadow-lg">
                      <BiDownload size={20} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <ActivityShareModal
          submission={submission}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}