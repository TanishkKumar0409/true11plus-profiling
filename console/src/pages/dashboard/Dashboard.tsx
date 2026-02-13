import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserProps } from "../../types/UserProps";
import { Link, useOutletContext } from "react-router-dom";
import type {
  CategoryProps,
  DashboardOutletContextProps,
} from "../../types/Types";
import { API } from "../../contexts/API";
import { getErrorResponse, getFieldDataSimple } from "../../contexts/Callbacks";
import { LuUsers, LuLayers } from "react-icons/lu";
import { BiUserCheck, BiUserMinus, BiUserPlus } from "react-icons/bi";
import DashboardCard from "../../ui/card/DashboardCard";
import type { TaskProps } from "../../types/AcademicStructureType";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import DashboardSkeleton from "../../ui/loading/pages/DashboardSkeleton";

export default function Dashboard() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { getRoleById, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const initDashboard = useCallback(async () => {
    try {
      setLoading(true);
      startLoadingBar();
      const [usersResponse, tasksResponse] = await Promise.allSettled([
        API.get("/users"),
        API.get("/task/all"),
      ]);
      if (usersResponse.status === "fulfilled") {
        const data = usersResponse.value.data;
        const finalUsers = (data || []).reduce(
          (acc: UserProps[], item: UserProps) => {
            const useritem = { ...item, role: getRoleById(item.role) };
            if (useritem?.role !== "bot admin") {
              acc.push(useritem);
            }
            return acc;
          },
          [],
        );
        setUsers(finalUsers);
      } else {
        getErrorResponse(usersResponse.reason, true);
      }
      if (tasksResponse.status === "fulfilled") {
        setAllTasks(tasksResponse.value.data || []);
      } else {
        getErrorResponse(tasksResponse.reason, true);
      }
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [getRoleById, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  const userStats = useMemo(() => {
    const roleIcons = [LuUsers, BiUserCheck, BiUserPlus, BiUserMinus];
    const cardColors = ["blue", "purple", "green", "yellow"];

    return getFieldDataSimple(users, "role").map((item, index) => ({
      title: `${item.title} user`,
      value: item.value,
      icon: roleIcons[index % roleIcons.length],
      iconColor: cardColors[index % cardColors.length],
      percentage: Math.round((item.value / (users.length || 1)) * 100),
      link: `/dashboard/users?role=${item.title}`,
    }));
  }, [users]);

  const taskTypeStats = useMemo(() => {
    const normalizedTasks = allTasks.map((t) => {
      let label = "Uncategorized";
      if (typeof t.task_type === "object" && t.task_type !== null) {
        label = (t.task_type as CategoryProps).category_name;
      } else if (typeof t.task_type === "string") {
        label = t.task_type;
      }
      return { ...t, type_label: label };
    });

    const stats = getFieldDataSimple(normalizedTasks, "type_label");
    const typeColors = ["indigo", "orange", "cyan", "pink", "rose", "amber"];

    return stats.map((item, index) => ({
      title: `${item.title} task`,
      value: item.value,
      icon: LuLayers,
      iconColor: typeColors[index % typeColors.length],
      percentage: Math.round((item.value / (allTasks.length || 1)) * 100),
      link: `/dashboard/tasks?type=${item.title}`,
    }));
  }, [allTasks]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      <Breadcrumbs title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]} />
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((card, index) => (
            <Link
              key={`user-${index}`}
              to={card.link}
              className="block transition-transform hover:scale-[1.02]"
            >
              <DashboardCard
                title={card.title}
                value={card.value}
                iconColor={card.iconColor}
                percentage={card.percentage}
                icon={card.icon}
              />
            </Link>
          ))}

          {taskTypeStats.map((card, index) => (
            <Link
              key={`task-${index}`}
              to={card.link}
              className="block transition-transform hover:scale-[1.02]"
            >
              <DashboardCard
                title={card.title}
                value={card.value}
                iconColor={card.iconColor}
                percentage={card.percentage}
                icon={card.icon}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
