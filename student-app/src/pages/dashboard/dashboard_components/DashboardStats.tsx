import {
  LuArrowUpRight,
  LuGraduationCap,
  LuLightbulb,
  LuZap,
  LuBook,
  LuCpu,
  LuGlobe,
  LuMilestone,
  LuCompass,
  LuMedal,
  LuLayers,
  LuRocket,
} from "react-icons/lu";
import { useMemo } from "react";
import type { MergedTask } from "../Dashboard";

const ICON_POOL = [
  LuGraduationCap,
  LuLightbulb,
  LuZap,
  LuBook,
  LuCpu,
  LuGlobe,
  LuMilestone,
  LuCompass,
  LuMedal,
  LuLayers,
  LuRocket,
];
const COLOR_POOL = [
  {
    color: "text-(--success-emphasis)",
    bg: "from-(--success-subtle) to-white",
    emphasis: "bg-(--success-subtle) text-(--success-emphasis)",
  },
  {
    color: "text-(--orange-emphasis)",
    bg: "from-(--orange-subtle) to-white",
    emphasis: "bg-(--orange-subtle) text-(--orange-emphasis)",
  },
  {
    color: "text-(--blue-emphasis)",
    bg: "from-(--blue-subtle) to-white",
    emphasis: "bg-(--blue-subtle) text-(--blue-emphasis)",
  },
  {
    color: "text-(--purple-emphasis)",
    bg: "from-(--purple-subtle) to-white",
    emphasis: "bg-(--purple-subtle) text-(--purple-emphasis)",
  },
];

const getSeed = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

interface DashboardStatsProps {
  myTasks: MergedTask[];
}

export default function DashboardStats({ myTasks }: DashboardStatsProps) {
  const stats = useMemo(() => {
    // Basic grouping by status
    const groups = myTasks.reduce(
      (acc, task) => {
        const status = task.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = myTasks.length;

    return Object.entries(groups).map(([title, val]) => {
      const seed = getSeed(title);
      const percentage = total > 0 ? ((val / total) * 100).toFixed(0) : 0;
      const randomIcon = ICON_POOL[seed % ICON_POOL.length];
      const randomColor = COLOR_POOL[seed % COLOR_POOL.length];

      return {
        label: `${title.charAt(0).toUpperCase() + title.slice(1)} Task`,
        value: val,
        trend: `${percentage}%`,
        icon: randomIcon,
        colorClass: randomColor.color,
        bgClass: randomColor.bg,
        emphasisClass: randomColor.emphasis,
      };
    });
  }, [myTasks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="group bg-(--primary-bg) p-5 rounded-custom shadow-sm border border-(--gray-subtle) transition-all duration-300 relative overflow-hidden"
        >
          <div
            className={`absolute w-32 h-32 bg-linear-to-br ${item.bgClass} opacity-0 group-hover:opacity-30 transition-opacity blur-3xl -top-10 -right-10`}
          />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-(--gray) text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                {item.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-(--gray-emphasis)">
                  {item.value}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.emphasisClass} flex items-center gap-0.5`}
                >
                  {item.trend} <LuArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.bgClass} border border-white/60 flex items-center justify-center group-hover:scale-110 transition-all`}
            >
              <item.icon className={`w-6 h-6 ${item.colorClass}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
