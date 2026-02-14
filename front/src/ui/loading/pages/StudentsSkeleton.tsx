"use client";

import Skeleton from "react-loading-skeleton";

const StudentdsSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-8 md:py-12">
      <div className="mb-10 md:mb-16 space-y-4">
        <div className="max-w-full">
          <Skeleton width={120} height={20} className="rounded-custom" />
        </div>

        <div className="space-y-3">
          <div className="max-w-full overflow-hidden">
            <Skeleton
              width={500}
              height={50}
              className="max-w-full rounded-custom"
            />
          </div>
          <div className="max-w-full overflow-hidden">
            <Skeleton
              width={700}
              height={50}
              className="max-w-full rounded-custom"
            />
          </div>
        </div>

        <div className="max-w-full pt-4">
          <Skeleton width={450} height={16} className="max-w-full rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-custom p-5 md:p-6 shadow-custom overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton width={80} height={80} />

              <div className="space-y-2 flex-1">
                <Skeleton width={120} height={20} className="max-w-full" />
                <Skeleton width={80} height={16} className="max-w-full" />
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <Skeleton width="100%" height={12} />
              <Skeleton width="95%" height={12} />
              <Skeleton width="70%" height={12} />
            </div>

            <div className="w-full">
              <Skeleton height={48} className="w-full rounded-custom" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentdsSkeleton;
