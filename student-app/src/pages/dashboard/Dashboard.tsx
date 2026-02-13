import UpgradeCard from "./dashboard_components/UpgradCard";
import WelcomeCard from "./dashboard_components/WelcomeCard";
import DashboardStats from "./dashboard_components/DashboardStats";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useCallback, useEffect, useState } from "react";
import type { TaskProps } from "../../types/AcademicStructureType";
import type { DashboardOutletContextProps } from "../../types/Types";
import { useOutletContext } from "react-router-dom";
import { getErrorResponse } from "../../contexts/CallBacks";
import { API } from "../../contexts/API";
import DashboardSkeleton from "../../ui/loading/pages/DashboardSkeleton";

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

export const COLUMN_MAPPING = [
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

export default function Dashboard() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<MergedTask[]>([]);

  const fetchData = useCallback(async () => {
    startLoadingBar();
    if (!authUser?._id) return;
    try {
      const [allTasksRes, assignedRes] = await Promise.all([
        API.get("/task/all"),
        API.get(`/user/task/${authUser?._id}`),
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
  }, [authUser?._id,startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <Breadcrumbs title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <WelcomeCard myTasks={myTasks} />
          <DashboardStats myTasks={myTasks} />
        </div>
        <div className="lg:col-span-1 h-full">
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}
