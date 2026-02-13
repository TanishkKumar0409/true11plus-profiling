import type { MergedTask } from "../Task";
import TaskCard from "./TaskCard";

interface Column {
  id: string;
  width: number;
  title: string;
  bg: string;
  color: string;
  percentage: number;
}

interface TasksColumnProps {
  column: Column;
  tasks: MergedTask[];
  onResize: (id: string, e: React.MouseEvent) => void;
  isResizingActive: boolean;
}

const TasksColumn = ({
  column,
  tasks,
  onResize,
  isResizingActive,
}: TasksColumnProps) => (
  <div
    className="relative flex flex-col transition-all duration-300 pr-6 group"
    style={{ width: `${column.width}px`, height: "calc(100vh - 250px)" }}
  >
    <div
      onMouseDown={(e) => onResize(column.id, e)}
      className={`absolute right-3 top-0 bottom-0 w-1.5 cursor-col-resize z-20 bg-(--main-subtle) hover:bg-(--main) transition-colors ${
        isResizingActive ? "bg-(--main)" : ""
      }`}
    />

    <div className="mb-6 space-y-4 px-1 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <div className={`w-2.5 h-2.5 rounded-full ${column.bg}`} />
          <h2 className="font-bold text-(--text-color) truncate text-xs uppercase tracking-tighter">
            {column.title} ({tasks.length})
          </h2>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-(--text-color) font-bold uppercase tracking-widest">
          <span>Percentage</span>
          <span>{column.percentage}%</span>
        </div>
        <div className="h-1 w-full bg-(--secondary-bg) shadow-inner rounded-full overflow-hidden">
          <div
            className={`h-full ${column.bg} transition-all duration-700`}
            style={{ width: `${column.percentage}%` }}
          />
        </div>
      </div>
    </div>

    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scroll pb-10">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} columnColor={column.color} />
      ))}

      {tasks.length === 0 && (
        <div className="border-2 border-dashed border-(--border) rounded-xl p-8 text-center">
          <p className="text-xs text-(--text-color) font-medium italic opacity-60">
            No tasks in this stage
          </p>
        </div>
      )}
    </div>
  </div>
);

export default TasksColumn;
