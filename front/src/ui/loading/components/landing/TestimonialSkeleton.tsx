"use client";

import Skeleton from "react-loading-skeleton";

const TestimonialsSkeleton = () => {
  const cards = [1, 2, 3];

  return (
    <section className="w-full py-16 px-4 md:px-8">
      <div className="mb-12">
        <div className="mb-4">
          <Skeleton width={220} height={20} className="rounded-custom" />
        </div>
        <div className="max-w-xl">
          <Skeleton height={48} width="80%" className="mb-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((item) => (
          <div
            key={item}
            className="rounded-custom p-8 shadow-custom flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <Skeleton width={40} height={30} borderRadius={4} />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} width={16} height={16} />
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-12 grow">
              <Skeleton count={4} height={14} width="100%" />
              <Skeleton height={14} width="60%" />
            </div>

            <div className="flex items-center gap-4">
              <div className="p-1 rounded-custom">
                <Skeleton width={56} height={56} borderRadius={12} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton width={100} height={18} />
                  <Skeleton circle width={14} height={14} />
                </div>
                <Skeleton width={140} height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
