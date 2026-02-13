import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";
import TaskTabSkeleton from "../ui/tabs_compoents/TaskTabSkeleton";

export default function UserViewSkeleton({
  task_tab = false,
}: {
  task_tab?: boolean;
}) {
  return (
    <div className="flex-1 w-full max-w-full space-y-6">
      <BreadCrumbsSkeleton />

      <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden">
        <div className="h-48 bg-(--main) relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Skeleton width={70} height={24} />
            <Skeleton width={70} height={24} baseColor="var(--danger)" />
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
          <div className="p-1 rounded-full">
            <Skeleton circle width={128} height={128} />
          </div>
          <div className="pb-4 flex-1">
            <Skeleton width={200} height={28} className="mb-2" />
            <Skeleton width={100} height={16} />
          </div>
        </div>
      </div>

      <div className="flex gap-8 border-b border-(--border)">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 pb-3 ${i === 0 ? "border-b-3 border-(--main)" : ""}`}
            >
              <Skeleton width={18} height={18} />
              <Skeleton width={80} height={16} />
            </div>
          ))}
      </div>

      {!task_tab ? (
        <div className="space-y-4 bg-(--primary-bg) p-3 rounded-custom shadow-custom">
          <Skeleton width={150} height={20} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-(--secondary-bg) p-6 rounded-custom shadow-custom flex items-center gap-4"
                >
                  <Skeleton width={44} height={44} borderRadius={8} />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton width="40%" height={12} />
                    <Skeleton width="80%" height={16} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <TaskTabSkeleton />
      )}
    </div>
  );
}
