"use client";

import Skeleton from "react-loading-skeleton";

const StudentSkeleton = () => {
  const cards = [1, 2, 3, 4];

  return (
    <section className="w-full py-16 px-4 sm:px-8">
      <div className="mb-12">
        <div className="mb-4">
          <Skeleton width={220} height={20} className="rounded-custom" />
        </div>
        <div className="max-w-xl">
          <Skeleton height={48} width="80%" className="mb-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((item) => (
          <div
            key={item}
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

      <div className="mt-10">
        <Skeleton height={80} className="rounded-custom w-100" />
      </div>
    </section>
  );
};

export default StudentSkeleton;
