"use client";

import Skeleton from "react-loading-skeleton";

const HeroSkeleton = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 sm:px-8 py-12">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
          <div className="w-full max-w-[320px] sm:max-w-100 lg:max-w-125 aspect-square">
            <Skeleton
              height="90%"
              width="90%"
              style={{
                borderRadius: "100% 90% 100% 90%",
                display: "block",
              }}
              className="shadow-custom"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col order-2 md:order-1">
          <div className="mb-6">
            <Skeleton height={60} width="85%" className="mb-3" />
            <Skeleton height={60} width="60%" />
          </div>

          <div className="mb-10 space-y-3">
            <Skeleton count={3} height={18} />
            <Skeleton height={18} width="40%" />
          </div>

          <div>
            <Skeleton height={56} width={200} borderRadius={100} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
