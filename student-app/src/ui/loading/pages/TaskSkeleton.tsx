import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function TaskSkeleton() {
  return (
    <div>
      <BreadCrumbsSkeleton />
      <div className="bg-(--primary-bg) rounded-custom p-6 shadow-custom my-3 flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton
              width={40}
              height={40}
              borderRadius={8}
              baseColor="#a855f7"
            />
            <Skeleton width={200} height={24} />
          </div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} width={100} height={32} borderRadius={20} />
            ))}
          </div>
        </div>
        <div className="w-full max-w-100 bg-(--secondary-bg) rounded-custom p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Skeleton circle width={18} height={18} />
              <Skeleton width={120} height={12} />
            </div>
            <Skeleton width={40} height={24} />
          </div>
          <Skeleton height={12} borderRadius={10} className="mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton width={140} height={12} />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <Skeleton key={dot} circle width={8} height={8} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-auto gap-6 pb-10">
        {Array(6)
          .fill(true)
          .map((status, idx) => (
            <div key={status} className="space-y-4 min-w-70">
              <div className="flex items-center gap-2 px-2">
                <Skeleton
                  circle
                  width={10}
                  height={10}
                  baseColor={idx % 2 === 0 ? "var(--main)" : "var(--success)"}
                />
                <Skeleton width={120} height={14} />
              </div>
              <div className="flex justify-between px-2 mb-4">
                <Skeleton width={80} height={12} />
                <Skeleton width={30} height={12} />
              </div>

              <div className="bg-(--primary-bg) rounded-custom p-5 shadow-custom space-y-4">
                <Skeleton width="80%" height={18} />
                <Skeleton count={2} width="100%" height={12} />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-4">
                    <Skeleton width={60} height={12} />
                    <Skeleton width={40} height={12} />
                  </div>
                  <Skeleton
                    width={70}
                    height={24}
                    borderRadius={20}
                    baseColor="var(--main-subtle)"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
