"use client";

import Skeleton from "react-loading-skeleton";

const FaqsSkeleton = () => {
  const faqItems = Array(6).fill(0);

  return (
    <section className="w-full py-20 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col">
          <div className="mb-6">
            <Skeleton width={150} height={28} borderRadius={50} />
          </div>

          <div className="mb-6">
            <Skeleton height={60} width="90%" className="mb-2" />
            <Skeleton height={60} width="70%" />
          </div>

          <div className="mb-12 max-w-md">
            <Skeleton count={2} height={16} className="mb-2" />
            <Skeleton height={16} width="40%" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} circle width={48} height={48} />
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton width={120} height={18} />
              <Skeleton width={180} height={14} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((_, index) => (
            <div
              key={index}
              className="w-full bg-slate-50/50 rounded-custom p-2 flex items-center justify-between"
            >
              <Skeleton
                width={`${Math.floor(Math.random() * (80 - 40 + 1)) + 40}%`}
                height={20}
              />

              <Skeleton
                circle
                width={32}
                height={32}
                className="shadow-custom"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqsSkeleton;
