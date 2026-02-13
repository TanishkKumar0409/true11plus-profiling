import { Link, useParams } from "react-router-dom";
import { BiTimeFive } from "react-icons/bi";
import type { MergedTask } from "../StudentTaskTab";
import { getStatusColor, stripHtml } from "../../../../contexts/Callbacks";
import Badge from "../../../../ui/badge/Badge";

interface TaskCardProps {
  task: MergedTask;
  columnColor: string;
}

const TaskCard = ({ task, columnColor }: TaskCardProps) => {
  const { objectId } = useParams();
  return (
    <Link
      to={`/dashboard/student/${objectId}/tasks/${task?._id}`}
      className={`block bg-(--primary-bg) p-4 rounded-xl border-l-[5px] ${columnColor} shadow-sm hover:shadow-md transition-all border group card`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="leading-snug">{task.title}</h4>
      </div>

      <p className="text-xs text-(--text-color) line-clamp-2 mb-4 leading-relaxed">
        {stripHtml(task.objective, 80)}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 font-medium text-[10px] text-(--text-color)">
          <span className="flex items-center gap-1">
            <BiTimeFive className="w-3 h-3" />
            {task.duration
              ? `${task.duration.duration_value} ${task.duration.duration_type}`
              : "No limit"}
          </span>
          <span className="flex items-center gap-1 uppercase tracking-tighter text-(--text-color) px-1.5 py-0.5 rounded">
            {typeof task.difficulty_level === "object"
              ? task.difficulty_level?.category_name
              : task.difficulty_level}
          </span>
          <Badge
            children={task?.status}
            variant={getStatusColor(task?.status || "")}
          />
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
