import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";

export default function TaskViewSkeleton() {
  return (
    <div>
      <BreadCrumbsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-12 mt-3 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-(--primary-bg) p-8 rounded-custom shadow-custom flex justify-between items-center">
            <Skeleton width={300} height={32} />
            <Skeleton
              width={70}
              height={24}
              borderRadius={20}
              baseColor="#dcfce7"
            />
          </div>

          {Array(4)
            .fill(true)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-(--primary-bg) p-8 rounded-custom shadow-custom space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-(--main) rounded-full" />
                  <Skeleton width={140} height={20} />
                </div>

                <div className="space-y-4 pl-4">
                  {Array(5)
                    .fill(true)
                    .map((_, lineIdx) => (
                      <div key={lineIdx} className="flex gap-3 items-start">
                        <div className="shrink-0 pt-1">
                          <Skeleton width={20} height={14} />
                        </div>

                        <div className="flex-1">
                          <Skeleton
                            width={lineIdx === 4 ? "60%" : "100%"}
                            height={14}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="lg:col-span-4">
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
