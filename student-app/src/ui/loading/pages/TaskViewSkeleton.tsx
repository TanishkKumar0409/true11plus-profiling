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

          <div className="bg-(--primary-bg) p-8 rounded-custom shadow-custom space-y-6">
            <div className="flex justify-between">
              <Skeleton width={200} height={20} />
              <Skeleton width={100} height={24} />
            </div>
            <Skeleton width={150} height={12} />
            <div className="my-3">
              <Skeleton height={150} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-(--border) rounded-custom p-8 flex flex-col items-center gap-3">
                <Skeleton width={40} height={40} />
                <Skeleton width={140} height={12} />
              </div>
              <div className="border-2 border-dashed border-(--border) rounded-custom p-8 flex flex-col items-center gap-3">
                <Skeleton width={40} height={40} />
                <Skeleton width={140} height={12} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Skeleton width={140} height={48} baseColor="var(--main)" />
            </div>
          </div>
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
