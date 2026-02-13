import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function UserEditSkeleton() {
  return (
    <div className="flex-1 w-full max-w-full space-y-6">
      <BreadCrumbsSkeleton />

      <div className="bg-(--primary-bg) rounded-custom shadow-custom p-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width={100} height={14} />
                <Skeleton height={45} />
              </div>
            ))}
        </div>

        <div className="space-y-2">
          <Skeleton width={80} height={14} />
          <Skeleton height={120} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width={80} height={14} />
                <Skeleton height={45} />
              </div>
            ))}
        </div>

        <div className="bg-(--secondary-bg) p-6 rounded-custom shadow-custom flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton width={120} height={18} />
            <Skeleton width={250} height={12} />
          </div>
          <Skeleton width={50} height={24} />
        </div>

        <div className="flex justify-end">
          <Skeleton width={160} height={48} />
        </div>
      </div>
    </div>
  );
}
