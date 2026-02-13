import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function StudentTaskReviewSkeleton() {
  return (
    <div className="flex-1 w-full max-w-full space-y-6">
      <BreadCrumbsSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton circle width={64} height={64} />
            <div className="space-y-1">
              <Skeleton width={100} height={20} />
              <Skeleton width={150} height={14} />
            </div>
          </div>
          <Skeleton width={24} height={24} />
        </div>
        <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton width={20} height={20} />
              <Skeleton width={100} height={16} />
            </div>
            <Skeleton width={150} height={24} />
            <div className="flex gap-2">
              <Skeleton width={80} height={24} />
              <Skeleton width={80} height={24} />
            </div>
          </div>
          <Skeleton width={24} height={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom space-y-8">
            <div className="flex justify-between items-center border-b border-(--border) pb-4">
              <div className="space-y-1">
                <Skeleton width={140} height={24} />
                <Skeleton width={200} height={14} />
              </div>
              <Skeleton width={80} height={28} />
            </div>

            <div className="space-y-4">
              <Skeleton width={150} height={20} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-(--secondary-bg) mt-2 p-6 rounded-xl">
                <div className="bg-(--primary-bg) p-4 rounded-custom shadow-custom space-y-2 text-center">
                  <Skeleton width={100} height={14} className="mx-auto" />
                  <Skeleton width={60} height={40} className="mx-auto" />
                </div>
                <div className="bg-(--primary-bg) p-4 rounded-custom shadow-custom space-y-2 text-center">
                  <Skeleton width={100} height={14} />
                  <Skeleton width="80%" height={20} />
                </div>
              </div>
            </div>

            {/* Student Notes */}
            <div className="space-y-2">
              <Skeleton width={120} height={20} />

              <div className="bg-(--secondary-bg) mt-3 p-4 rounded-custom shadow-custom space-y-2 text-center">
                <Skeleton count={2} />
              </div>
            </div>

            {/* Attached Documents */}
            <div className="space-y-4">
              <Skeleton width={140} height={20} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-custom shadow-custom bg-(--secondary-bg) mt-2"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton width={32} height={32} />
                        <div className="space-y-1">
                          <Skeleton width={100} height={12} />
                          <Skeleton width={40} height={10} />
                        </div>
                      </div>
                      <Skeleton width={20} height={20} />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton width={80} height={20} />
              <div className="flex flex-wrap gap-4 mt-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} width={100} height={100} />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-(--primary-bg) p-8 rounded-custom shadow-custom sticky top-8 space-y-8">
            <div className="flex items-center gap-2 border-b border-(--border) pb-4">
              <div className="w-1 h-4 bg-(--main) rounded-full" />
              <Skeleton width={120} height={18} />
            </div>

            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-center gap-4">
                <Skeleton width={44} height={44} />
                <div className="flex-1 space-y-1">
                  <Skeleton width="60%" height={10} />
                  <Skeleton width="80%" height={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
