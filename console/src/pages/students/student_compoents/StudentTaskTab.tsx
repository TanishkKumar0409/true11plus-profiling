import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorResponse } from "../../../contexts/Callbacks";
import type { TaskProps } from "../../../types/AcademicStructureType";
import { API } from "../../../contexts/API";
import type { UserProps } from "../../../types/UserProps";
import TaskHeader from "./all_task_components/TaskHeader";
import TasksColumn from "./all_task_components/TaskColumn";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import TaskTabSkeleton from "../../../ui/loading/ui/tabs_compoents/TaskTabSkeleton";

interface AssignedTaskEntry {
  task_id: string;
  status: string;
  _id: string;
}

export interface MergedTask extends TaskProps {
  status: string;
  assignment_id: string;
  colId: string;
}

const COLUMN_MAPPING = [
  {
    id: "col-1",
    title: "Rejected",
    color: "border-red-400",
    bg: "bg-red-400",
    weight: 10,
    statuses: ["rejected"],
  },
  {
    id: "col-2",
    title: "Not started",
    color: "border-gray-400",
    bg: "bg-gray-400",
    weight: 0,
    statuses: ["assign"],
  },
  {
    id: "col-3",
    title: "Started",
    color: "border-blue-400",
    bg: "bg-blue-400",
    weight: 28,
    statuses: ["started"],
  },
  {
    id: "col-4",
    title: "Submitted",
    color: "border-indigo-400",
    bg: "bg-indigo-400",
    weight: 80,
    statuses: ["submitted", "pending"],
  },
  {
    id: "col-5",
    title: "On hold",
    color: "border-orange-400",
    bg: "bg-orange-400",
    weight: 40,
    statuses: ["hold"],
  },
  {
    id: "col-6",
    title: "Completed",
    color: "border-green-400",
    bg: "bg-green-400",
    weight: 100,
    statuses: ["approved", "completed"],
  },
];

export default function StudentTaskTab({ user }: { user: UserProps | null }) {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<MergedTask[]>([]);
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    "col-1": 320,
    "col-2": 320,
    "col-3": 320,
    "col-4": 320,
    "col-5": 320,
    "col-6": 320,
  });
  const [visibleCols, setVisibleCols] = useState<string[]>(() => {
    const saved = localStorage.getItem("task_visible_columns");
    return saved ? JSON.parse(saved) : COLUMN_MAPPING.map((c) => c.id);
  });
  const [resizingCol, setResizingCol] = useState<{
    id: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    startLoadingBar();
    if (!user?._id) return;
    try {
      const [allTasksRes, assignedRes] = await Promise.all([
        API.get("/task/all"),
        API.get(`/user/task/${user?._id}`),
      ]);

      const allTasks: TaskProps[] =
        allTasksRes.data?.tasks || allTasksRes.data || [];
      const assignmentData =
        assignedRes.data?.assignment || assignedRes.data || {};
      const assignedEntries: AssignedTaskEntry[] = assignmentData.tasks || [];

      const assignmentMap = new Map<string, { status: string; id: string }>();
      assignedEntries.forEach((entry) => {
        if (entry.task_id) {
          assignmentMap.set(entry.task_id, {
            status: entry.status.toLowerCase(),
            id: entry._id,
          });
        }
      });

      const merged: MergedTask[] = allTasks
        .filter((t) => assignmentMap.has(t._id))
        .map((t) => {
          const details = assignmentMap.get(t._id)!;
          const targetCol =
            COLUMN_MAPPING.find((c) => c.statuses.includes(details.status)) ||
            COLUMN_MAPPING[1];
          return {
            ...t,
            status: details.status,
            assignment_id: details.id,
            colId: targetCol.id,
          };
        });

      setMyTasks(merged);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [user?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const dynamicColumns = useMemo(() => {
    const total = myTasks.length;
    return COLUMN_MAPPING.map((col) => {
      const tasksInCol = myTasks.filter((t) => t.colId === col.id).length;
      return {
        ...col,
        width: colWidths[col.id],
        percentage: total > 0 ? Math.round((tasksInCol / total) * 100) : 0,
        count: tasksInCol,
      };
    });
  }, [myTasks, colWidths]);

  const progressMetrics = useMemo(() => {
    const total = myTasks.length;
    if (total === 0) return { totalTasks: 0, globalProgress: 0 };
    const totalWeightSum = myTasks.reduce((acc, task) => {
      const column = COLUMN_MAPPING.find((c) => c.id === task.colId);
      return acc + (column ? column.weight : 0);
    }, 0);
    return {
      totalTasks: total,
      globalProgress: Math.round(totalWeightSum / total),
    };
  }, [myTasks]);

  // --- Resize Handlers ---
  const startResizing = (colId: string, e: React.MouseEvent) => {
    setResizingCol({
      id: colId,
      startX: e.clientX,
      startWidth: colWidths[colId],
    });
  };

  const doResizing = useCallback(
    (e: MouseEvent) => {
      if (!resizingCol) return;
      const delta = e.clientX - resizingCol.startX;
      const newWidth = Math.max(resizingCol.startWidth + delta, 200);
      setColWidths((prev) => ({ ...prev, [resizingCol.id]: newWidth }));
    },
    [resizingCol],
  );

  useEffect(() => {
    if (resizingCol) {
      window.addEventListener("mousemove", doResizing);
      window.addEventListener("mouseup", () => setResizingCol(null));
    }
    return () => {
      window.removeEventListener("mousemove", doResizing);
      window.removeEventListener("mouseup", () => setResizingCol(null));
    };
  }, [resizingCol, doResizing]);

  const toggleColumn = (id: string) => {
    setVisibleCols((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      localStorage.setItem("task_visible_columns", JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return <TaskTabSkeleton />;

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden font-sans ${resizingCol ? "cursor-col-resize select-none" : ""}`}
    >
      <TaskHeader
        columns={dynamicColumns}
        visibleCols={visibleCols}
        toggleColumn={toggleColumn}
        progressMetrics={progressMetrics}
      />
      <main className="flex-1 overflow-x-auto p-6 scrollbar-hide">
        <div
          className="flex flex-row h-full items-start"
          style={{ minWidth: "min-content" }}
        >
          {dynamicColumns
            .filter((c) => visibleCols.includes(c.id))
            .map((column) => (
              <TasksColumn
                key={column.id}
                column={column}
                tasks={myTasks.filter((t) => t.colId === column.id)}
                onResize={startResizing}
                isResizingActive={resizingCol?.id === column.id}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
