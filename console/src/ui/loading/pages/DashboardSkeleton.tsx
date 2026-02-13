import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";
import DashboardCardSkeleton from "../ui/card/DashboardCardSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex-1 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <BreadCrumbsSkeleton />
        <Skeleton width={100} height={40} borderRadius={8} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}
