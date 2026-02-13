import Skeleton from "react-loading-skeleton";

export default function DashboardCardSkeleton() {
  return (
    <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton width={120} height={24} className="mb-2" />
          <Skeleton width={40} height={36} />
        </div>
        <Skeleton width={44} height={44} borderRadius={12} />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <Skeleton width={60} height={14} />
          <Skeleton width={35} height={14} />
        </div>
        <Skeleton height={8} borderRadius={10} />
      </div>
    </div>
  );
}
