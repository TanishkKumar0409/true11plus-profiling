import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function StudentTaskAssignSkeleton() {
  return (
    <div className="flex-1 w-full max-w-full space-y-6">
      <BreadCrumbsSkeleton />

      <div className="bg-(--primary-bg) rounded-custom shadow-custom p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <Skeleton circle width={64} height={64} className="shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={24} />
          </div>
        </div>
        <Skeleton width={140} height={45} className="w-full md:w-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-4 space-y-4 order-2 lg:order-1">
          <div className="flex gap-2">
            <div className="flex-1">
              <Skeleton height={45} />
            </div>
            <Skeleton width={45} height={45} />
          </div>

          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-(--primary-bg) p-4 rounded-custom shadow-custom space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton
                      circle
                      width={20}
                      height={20}
                      className="shrink-0"
                    />
                    <Skeleton width="60%" height={18} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton width={70} height={22} />
                    <Skeleton width={70} height={22} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Content: Task Details */}
        <div className="col-span-1 lg:col-span-8 bg-(--primary-bg) rounded-custom shadow-custom p-4 md:p-8 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-(--border) pb-6 mb-6 gap-4">
            <div className="space-y-2 w-full">
              <Skeleton width="70%" height={28} />
              <div className="flex items-center gap-2">
                <Skeleton width={20} height={20} />
                <Skeleton width={100} height={16} />
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
              <Skeleton width={60} height={12} className="mb-1" />
              <Skeleton width={80} height={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-(--secondary-bg) p-4 md:p-6 rounded-xl space-y-2">
              <Skeleton width={80} height={12} />
              <Skeleton width="40%" height={18} />
            </div>
            <div className="bg-(--secondary-bg) p-4 md:p-6 rounded-xl space-y-2">
              <Skeleton width={80} height={12} />
              <Skeleton width="50%" height={18} />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton width={120} height={20} />
            <div className="space-y-3 sm:pl-4">
              <Skeleton width="95%" height={14} />
              <Skeleton width="90%" height={14} />
              <Skeleton width="60%" height={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
