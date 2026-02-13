import type { TaskProps } from "../../../types/AcademicStructureType";
import { BiBarChart, BiHash, BiCalendar } from "react-icons/bi";
import { BsActivity } from "react-icons/bs";
import React, { type ReactElement } from "react";
import type { IconBaseProps } from "react-icons/lib";
import { FaUsers } from "react-icons/fa";
import { CgLayoutGrid } from "react-icons/cg";
import { CiLock } from "react-icons/ci";
import { formatDate } from "../../../contexts/CallBacks";

interface MetricItem {
  label: string;
  value: string;
  icon: ReactElement<IconBaseProps>;
  iconBgColor: string;
  iconColor: string;
  isId?: boolean;
}

type SidebarMetricProps = Omit<MetricItem, "isId" | "value"> & {
  value: React.ReactNode;
};

const SidebarMetric: React.FC<SidebarMetricProps> = ({
  icon,
  label,
  value,
  iconBgColor,
  iconColor,
}) => (
  <div className="flex items-center gap-4 group transition-all duration-300">
    <div
      className={`relative shrink-0 p-3 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}
    >
      {React.cloneElement(icon, { size: 20, strokeWidth: 2 } as IconBaseProps)}
    </div>

    <div className="flex flex-col">
      <p className="font-bold uppercase text-[10px] tracking-wider opacity-70">
        {label}
      </p>
      <p className="font-semibold leading-tight capitalize text-sm">{value}</p>
    </div>
  </div>
);

export default function TaskInfomationSidebar({ task }: { task: TaskProps }) {
  const taskData: { metrics: MetricItem[] } = {
    metrics: [
      {
        label: "Academic Group",
        value:
          typeof task.academic_group_id === "object"
            ? task.academic_group_id?.academic_group
            : "Group",
        icon: <FaUsers />,
        iconBgColor: "bg-[var(--blue-subtle)]",
        iconColor: "text-[var(--blue)]",
      },
      {
        label: "Task Type",
        value:
          typeof task.task_type === "object"
            ? task.task_type?.category_name
            : "Type",
        icon: <CgLayoutGrid />,
        iconBgColor: "bg-[var(--success-subtle)]",
        iconColor: "text-[var(--success)]",
      },
      {
        label: "Difficulty Level",
        value:
          typeof task.difficulty_level === "object"
            ? task.difficulty_level?.category_name
            : "Level",
        icon: <BiBarChart />,
        iconBgColor: "bg-[var(--orange-subtle)]",
        iconColor: "text-[var(--orange)]",
      },
      {
        label: "Est. Duration",
        value: `${task.duration?.duration_value || 0} ${task.duration?.duration_type || "hrs"}`,
        icon: <CiLock />,
        iconBgColor: "bg-[var(--purple-subtle)]",
        iconColor: "text-[var(--purple)]",
      },
      {
        label: "Assigned Date",
        value: formatDate(task?.assign_date || ""),
        icon: <BiCalendar />,
        iconBgColor: "bg-[var(--warning-subtle)]",
        iconColor: "text-[var(--warning)]",
      },
      {
        label: "Task ID",
        value: task._id || "",
        icon: <BiHash />,
        iconBgColor: "bg-[var(--gray-subtle)]",
        iconColor: "text-[var(--gray)]",
        isId: true,
      },
    ],
  };

  return (
    <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-(--border)">
        <div className="flex items-center gap-2">
          <BsActivity className="text-(--main)" size={18} />
          <h4 className="font-bold uppercase">Information</h4>
        </div>
      </div>
      <div className="space-y-6">
        {taskData.metrics.map((m, i) => (
          <SidebarMetric
            key={i}
            icon={m.icon}
            label={m.label}
            iconBgColor={m.iconBgColor}
            iconColor={m.iconColor}
            value={
              m.isId ? (
                <span className="text-[10px] break-all text-(--text-color) block mt-1 font-mono opacity-60">
                  {m.value}
                </span>
              ) : (
                m.value
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
