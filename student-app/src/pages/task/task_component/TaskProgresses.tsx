import { useMemo } from "react";
import type { TaskProps } from "../../../types/AcademicStructureType";
import { CircularProgress } from "../../../ui/progress/CircularProgress";
import { BiTimeFive } from "react-icons/bi";

export default function TaskProgresses({ myTasks }: { myTasks: TaskProps[] }) {
  const stats = useMemo(() => {
    const total = myTasks.length;
    let started = 0;
    let hold = 0;
    let submitted = 0;
    let rejected = 0;
    let notStarted = 0;

    if (total === 0) {
      return {
        total: 0,
        startedPct: 0,
        holdPct: 0,
        submittedPct: 0,
        rejectedPct: 0,
        notStartedpct: 0,
      };
    }

    myTasks.forEach((t) => {
      const s = t.status;
      if (s === "started") started++;
      else if (s === "hold") hold++;
      else if (s === "submitted" || s === "pending") submitted++;
      else if (s === "rejected") rejected++;
      else if (s === "assign") notStarted++;
    });

    return {
      total,
      startedPct: Math.round((started / total) * 100),
      holdPct: Math.round((hold / total) * 100),
      submittedPct: Math.round((submitted / total) * 100),
      rejectedPct: Math.round((rejected / total) * 100),
      notStartedpct: Math.round((notStarted / total) * 100),
    };
  }, [myTasks]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-6">
        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
          <BiTimeFive />
        </div>
        Task Status
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-2 justify-items-center">
        <CircularProgress
          percentage={stats.startedPct}
          color="#3b82f6"
          label="Started"
        />
        <CircularProgress
          percentage={stats.holdPct}
          color="#f97316"
          label="On Hold"
        />
        <CircularProgress
          percentage={stats.submittedPct}
          color="#8b5cf6"
          label="Submitted"
        />
        <CircularProgress
          percentage={stats.rejectedPct}
          color="#ef4444"
          label="Rejected"
        />
        <CircularProgress
          percentage={stats.notStartedpct}
          color="#3b82f6"
          label="Not Started"
        />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm">
          Total assigned tasks:{" "}
          <span className="font-bold text-gray-900">{stats.total}</span>
        </p>
      </div>
    </div>
  );
}
