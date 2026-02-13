import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { API } from "../../../contexts/API";
import { getErrorResponse, getStatusColor } from "../../../contexts/Callbacks";
import { Breadcrumbs } from "../../../ui/breadcrumbs/Breadcrumbs";
import ReadMoreLess from "../../../ui/read-more/ReadMoreLess";
import type { TaskProps } from "../../../types/AcademicStructureType";
import Badge from "../../../ui/badge/Badge";
import TaskInfomationSidebar from "./task_components/TaskInfomationSidebar";
import type { DashboardOutletContextProps } from "../../../types/Types";
import TaskViewSkeleton from "../../../ui/loading/pages/TaskViewSkeleton";

export default function TaskView() {
  const { objectId } = useParams();
  const [task, setTask] = useState<TaskProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const getTaskDetails = useCallback(async () => {
    try {
      startLoadingBar();
      setLoading(true);
      const response = await API.get(`/task/${objectId}`);
      setTask(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [objectId]);

  useEffect(() => {
    getTaskDetails();
  }, [getTaskDetails]);

  if (loading) return <TaskViewSkeleton />;

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-(--text-color)">
        <h2 className="text-xl font-bold">Task not found</h2>
        <Link
          to="/dashboard/tasks"
          className="text-(--main) hover:underline mt-2"
        >
          Return to Task List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs
        title="View Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tasks", path: "/dashboard/tasks" },
          { label: "Details" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <header className="relative bg-(--primary-bg) p-10 shadow-custom rounded-custom overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Badge
                dot
                children={task?.status}
                variant={getStatusColor(task?.status)}
              />
            </div>
            <h1 className="text-6xl font-black mt-6 tracking-tighter text-(--text-color-emphasis) leading-tight uppercase drop-shadow-sm">
              {task.title}
            </h1>
          </header>
          <div className="grid gap-8">
            <section
              className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
            >
              <div
                className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
              >
                <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                  Objective
                </h2>
              </div>
              <ReadMoreLess children={task?.objective} limit={150} />
            </section>
            <section
              className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
            >
              <div
                className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
              >
                <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                  Steps
                </h2>
              </div>
              <ReadMoreLess children={task?.steps_to_implement} limit={150} />
            </section>
            <section
              className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
            >
              <div
                className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
              >
                <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                  Deliverable
                </h2>
              </div>
              <ReadMoreLess children={task?.final_deliverable} limit={150} />
            </section>
            <section
              className={`rounded-custom p-6 shadow-custom transition-all bg-(--primary-bg)`}
            >
              <div
                className={`flex items-center gap-4 mb-8 border-l-4 border-(--main) pl-4`}
              >
                <h2 className="text-xl font-black text-(--text-color) tracking-tight italic uppercase">
                  Important Details
                </h2>
              </div>
              <ReadMoreLess children={task?.important_details} limit={150} />
            </section>
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-20 space-y-3">
            <TaskInfomationSidebar task={{ ...task }} />
          </div>
        </aside>
      </div>
    </div>
  );
}
