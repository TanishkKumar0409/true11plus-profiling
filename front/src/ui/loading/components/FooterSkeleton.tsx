"use client";

import Skeleton from "react-loading-skeleton";

const FooterSkeleton = () => {
  return (
    <section className="w-full pt-16 pb-8 px-6 md:px-8 border-t border-(--border)">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <Skeleton width={130} height={40} />
          <div className="space-y-2">
            <Skeleton count={3} className="h-3" />
          </div>
          <div className="flex space-x-3 pt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} circle width={40} height={40} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton width={100} height={25} className="mb-4" />
          <div className="space-y-3">
            <Skeleton count={4} width={150} height={18} />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton width={100} height={25} className="mb-4" />
          <div className="space-y-3">
            <Skeleton count={4} width={180} height={18} />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton width={120} height={25} className="mb-4" />
          <div className="flex items-center space-x-3">
            <Skeleton circle width={24} height={24} />
            <Skeleton width={160} height={16} />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton circle width={24} height={24} />
            <Skeleton width={140} height={16} />
          </div>
        </div>
      </div>

      <div className="border-t border-(--border) pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <Skeleton width={250} height={15} />
        <div className="flex space-x-6">
          <Skeleton width={80} height={15} />
          <Skeleton width={100} height={15} />
          <Skeleton width={80} height={15} />
        </div>
      </div>
    </section>
  );
};

export default FooterSkeleton;
