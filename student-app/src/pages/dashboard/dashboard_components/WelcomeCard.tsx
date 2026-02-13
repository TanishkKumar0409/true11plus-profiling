import { LuBookOpen, LuTarget } from "react-icons/lu";
import { Link, useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { BsActivity } from "react-icons/bs";
import { useState, useMemo } from "react";
import { type MergedTask, COLUMN_MAPPING } from "../Dashboard";

interface WelcomeCardProps {
  myTasks: MergedTask[];
}

export default function WelcomeCard({ myTasks }: WelcomeCardProps) {
  const [hoveredValue, setHoveredValue] = useState<any>(null);
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const dynamicColumns = useMemo(() => {
    const total = myTasks.length;
    return COLUMN_MAPPING.map((col) => {
      const tasksInCol = myTasks.filter((t) => t.colId === col.id).length;
      return {
        ...col,
        percentage: total > 0 ? Math.round((tasksInCol / total) * 100) : 0,
        count: tasksInCol,
      };
    });
  }, [myTasks]);

  const completedCol = dynamicColumns.find(
    (c) => c.title.toLowerCase() === "completed",
  );
  const currentPercent = hoveredValue
    ? hoveredValue.percentage
    : (completedCol?.percentage ?? 0);
  const currentTitle = hoveredValue ? hoveredValue.title : "Completed";

  return (
    <div className="h-full bg-(--main) p-6 text-(--white) overflow-hidden flex flex-col justify-center min-h-60 shadow-custom rounded-custom border border-(--main-subtle)">
      <div className="flex items-center gap-2 mb-2">
        <LuTarget className="text-(--main-subtle) w-5 h-5 shrink-0" />
        <h1 className="font-semibold text-lg tracking-tight">
          Targeting Excellence, {authUser?.username || "Scholar"}
        </h1>
      </div>

      <p className="text-(--white)! mb-6 leading-relaxed text-sm md:text-base">
        Your admissions profile is currently at{" "}
        <span className="font-bold text-(--main-subtle) underline underline-offset-4">
          Competitive
        </span>{" "}
        standing. Complete your current{" "}
        <span className="italic">Super-Curricular Research</span> task to boost
        your standing.
      </p>

      <div className="flex flex-wrap gap-3">
        <div className="bg-(--secondary-bg) p-5 w-full lg:w-96 shadow-inner rounded-custom text-(--text-main)">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black uppercase text-(--text-subtle) tracking-widest flex items-center gap-2">
              <BsActivity className="w-4 h-4 text-(--main)" /> All Task Growth
            </span>
            <div className="flex flex-col items-end">
              <span className="text-lg font-black text-(--main)">
                {currentPercent}%
              </span>
              <span className="text-[9px] text-(--text-subtle) font-bold uppercase">
                {currentTitle}
              </span>
            </div>
          </div>

          <div
            className="h-2.5 bg-(--main-subtle) rounded-full overflow-hidden flex cursor-pointer"
            onMouseLeave={() => setHoveredValue(null)}
          >
            {dynamicColumns.map((col) => (
              <div
                key={col.id}
                onMouseEnter={() => setHoveredValue(col)}
                style={{ width: `${col.percentage}%` }}
                className={`${col.bg} h-full border-r border-(--primary-bg) last:border-0 transition-all duration-500 hover:brightness-110 relative group`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                  {col.title}: {col.percentage}%
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2">
            <p className="font-bold italic text-xs text-(--text-subtle)">
              <span className="text-(--main) font-extrabold">
                {myTasks.length}
              </span>{" "}
              Active Assignments
            </p>
          </div>
        </div>
        <Link
          to="/task"
          className="inline-flex items-center gap-2 bg-(--white) text-(--main) hover:bg-(--main-subtle) px-6 py-2.5 rounded-custom font-bold text-sm shadow-lg self-end"
        >
          <LuBookOpen className="w-4 h-4" />
          <span>My Task</span>
        </Link>
      </div>
    </div>
  );
}
