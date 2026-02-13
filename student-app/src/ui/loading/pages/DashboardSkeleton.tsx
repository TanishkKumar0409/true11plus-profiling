import Skeleton from "react-loading-skeleton";
import UpgradeCard from "../../../pages/dashboard/dashboard_components/UpgradCard";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex-1 w-full max-w-full">
      <BreadCrumbsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-(--main) rounded-custom p-8 shadow-custom relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton circle width={24} height={24} />
              <Skeleton width={250} height={28} />
            </div>

            <div className="mb-8">
              <Skeleton count={2} width="80%" />
            </div>

            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="bg-(--primary-bg) rounded-custom p-4 w-full max-w-sm shadow-custom">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton width={120} height={12} />
                  <Skeleton width={40} height={20} />
                </div>
                <Skeleton height={12} borderRadius={10} className="mb-4" />
                <Skeleton width={100} height={12} />
              </div>
              <Skeleton width={120} height={45} borderRadius={10} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(true)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-(--primary-bg) p-6 rounded-custom shadow-custom flex justify-between items-center"
                >
                  <div>
                    <Skeleton width={100} height={12} className="mb-3" />
                    <div className="flex items-center gap-2">
                      <Skeleton width={20} height={24} />
                      <Skeleton width={45} height={18} borderRadius={15} />
                    </div>
                  </div>
                  <Skeleton width={48} height={48} borderRadius={12} />
                </div>
              ))}
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}
