import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function ProfileSkeleton() {
  return (
    <div>
      <BreadCrumbsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-(--primary-bg) p-4 rounded-custom flex items-center gap-4 shadow-custom">
            <Skeleton circle width={40} height={40} />
            <Skeleton width="100%" height={40} borderRadius={20} />
            <Skeleton width={24} height={24} />
          </div>

          <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
            <Skeleton height={280} />
            <div className="px-6 pb-6">
              <div className="relative flex justify-between items-end -mt-12 mb-4">
                <div className="-mt-3 border-4 border-(--border) rounded-full">
                  <Skeleton circle width={120} height={120} />
                </div>
                <div className="flex gap-3 mb-2">
                  <Skeleton
                    width={140}
                    height={40}
                    borderRadius={10}
                    baseColor="var(--main)"
                  />
                  <Skeleton width={100} height={40} borderRadius={10} />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton width={200} height={24} />
                  <Skeleton width={250} height={14} />
                  <Skeleton width={120} height={12} />
                </div>
                <div className="flex gap-10">
                  <div className="text-center">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={60} height={10} className="mt-1" />
                  </div>
                  <div className="text-center">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={60} height={10} className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-(--primary-bg) rounded-custom shadow-custom space-y-4"
            >
              <div className="p-3 pb-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={45} height={45} />
                    <div>
                      <Skeleton width={100} height={14} className="mb-1" />
                      <div className="flex gap-2">
                        <Skeleton width={80} height={10} />
                        <Skeleton width={50} height={10} />
                      </div>
                    </div>
                  </div>
                  <Skeleton width={20} height={10} />
                </div>
                <Skeleton width="60%" height={14} />
              </div>
              <Skeleton height={450} borderRadius={12} />
              <div className="flex justify-between p-4">
                <Skeleton width={50} height={15} />
                <Skeleton width={80} height={15} />
                <Skeleton width={50} height={15} />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-(--primary-bg) rounded-custom p-6 shadow-custom">
              <div className="mb-6">
                <Skeleton width={180} height={20} className="mb-1" />
                <Skeleton width={140} height={12} />
              </div>

              {/* User List */}
              {[1, 2].map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between mb-6 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={44} height={44} />
                    <div className="space-y-1">
                      <Skeleton width={100} height={14} />
                      <Skeleton width={120} height={10} />
                      <Skeleton width={90} height={10} />
                    </div>
                  </div>
                  <Skeleton circle width={32} height={32} />
                </div>
              ))}

              {/* Sidebar Footer Link */}
              <div className="mt-6 p-2 bg-(--secondary-bg) rounded-custom shadow-custom flex items-center justify-between">
                <Skeleton width={150} height={12} />
                <Skeleton circle width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
