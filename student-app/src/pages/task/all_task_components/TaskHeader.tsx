import { useState } from "react";
import { BsActivity, BsEye, BsLayers } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";

interface Column {
  id: string;
  title: string;
  bg: string;
  percentage: number;
}

interface ProgressMetrics {
  globalProgress: number;
  totalTasks: number;
}

interface TaskHeaderProps {
  columns: Column[];
  visibleCols: string[];
  toggleColumn: (id: string) => void;
  progressMetrics: ProgressMetrics;
}

const TaskHeader = ({
  columns,
  visibleCols,
  toggleColumn,
  progressMetrics,
}: TaskHeaderProps) => {
  const [hoveredValue, setHoveredValue] = useState<Column | null>(null);

  const completedCol = columns.find((c) => c.title.toLowerCase() === "completed");
  
  const currentPercent = hoveredValue 
    ? hoveredValue.percentage 
    : (completedCol?.percentage ?? progressMetrics.globalProgress);

  const currentTitle = hoveredValue 
    ? hoveredValue.title 
    : "Completed";

  return (
    <header className="bg-(--primary-bg) p-6 shadow-custom rounded-custom z-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Brand & Toggles */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--main) rounded-custom shadow-custom">
              <BsLayers className="w-4 h-4 text-(--white)" />
            </div>
            <h3 className="font-bold tracking-tight">Tasks Workflow</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {columns.map((col) => (
              <button
                key={col.id}
                onClick={() => toggleColumn(col.id)}
                className={`px-3 py-1.5 sub-paragraph font-medium transition-all border flex items-center gap-2 rounded-custom ${
                  visibleCols.includes(col.id)
                    ? "bg-(--main-subtle) border-(--main) text-(--main)! shadow-custom"
                    : "bg-(--secondary-bg) border-transparent text-(--text-color) opacity-60"
                }`}
              >
                {visibleCols.includes(col.id) ? (
                  <BsEye className="w-3.5 h-3.5" />
                ) : (
                  <FiEyeOff className="w-3.5 h-3.5" />
                )}
                {col.title}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Card */}
        <div className="bg-(--secondary-bg) p-5 w-full lg:w-96 shadow-inner rounded-custom">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black uppercase text-(--text-subtle) tracking-widest flex items-center gap-2">
              <BsActivity className="w-4 h-4 text-(--main)" /> All Task Growth
            </span>
            <div className="flex flex-col items-end">
              <span className="text-lg font-black text-(--main) transition-all duration-200">
                {currentPercent}%
              </span>
              <span className="text-[9px] text-(--text-subtle) font-bold uppercase tracking-tighter">
                Total {currentTitle}
              </span>
            </div>
          </div>

          <div
            className="h-2.5 bg-(--main-subtle) rounded-full overflow-hidden flex shadow-inner cursor-pointer"
            onMouseLeave={() => setHoveredValue(null)}
          >
            {columns.map((col) => {
              if (col.percentage <= 0) return null;
              return (
                <div
                  key={col.id}
                  onMouseEnter={() => setHoveredValue(col)}
                  style={{ width: `${col.percentage}%` }}
                  className={`${col.bg} h-full border-r border-(--primary-bg) last:border-0 transition-all duration-500 hover:brightness-110 relative group`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {col.title}: {col.percentage}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-2">
            <p className="font-bold italic sub-paragraph text-xs">
              <span className="text-(--main) font-extrabold">
                {progressMetrics.totalTasks}
              </span>{" "}
              Active Assignments
            </p>
            <div className="flex gap-1.5">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={`w-1.5 h-1.5 rounded-full ${col.bg} ${
                    col.percentage > 0 ? "opacity-100" : "opacity-20"
                  }`}
                  title={`${col.title}: ${col.percentage}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TaskHeader;