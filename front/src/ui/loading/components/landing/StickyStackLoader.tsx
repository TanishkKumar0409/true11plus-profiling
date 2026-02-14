"use client";

import Skeleton from "react-loading-skeleton";

const StickyStackLoader = () => {
  const skeletonSections = [0, 1, 2];

  return (
    <div className="relative w-full ">
      {skeletonSections.map((_, index) => {
        const isImageLeft = index % 2 !== 0;

        return (
          <section
            key={index}
            className="sticky top-0 h-screen w-full flex items-start justify-center overflow-hidden bg-white "
            style={{ zIndex: index + 1 }}
          >
            <div
              className={`absolute bottom-0 opacity-[0.03] pointer-events-none select-none ${isImageLeft ? "-right-10" : "-left-10"}`}
            >
              <Skeleton width="40vw" height="40vw" />
            </div>

            <div
              className={`mt-12 px-6 md:px-12 w-full flex flex-col items-center gap-12 lg:gap-20 z-10 
                ${isImageLeft ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <Skeleton width={64} height={64} borderRadius={16} />
                  <div className="space-y-2">
                    <Skeleton width={80} height={12} />
                    <Skeleton width={120} height={16} />
                  </div>
                </div>

                <div className="mb-6">
                  <Skeleton height={50} width="90%" className="mb-2" />
                  <Skeleton height={50} width="60%" />
                </div>

                <div className="mb-8">
                  <Skeleton height={28} width="75%" />
                </div>

                <div className="mb-10 space-y-3">
                  <Skeleton count={3} height={16} />
                  <Skeleton height={16} width="40%" />
                </div>

                <div>
                  <Skeleton height={56} width={200} borderRadius={12} />
                </div>
              </div>

              <div className="relative w-full md:w-1/2 flex justify-center">
                <div className="relative w-full aspect-square max-w-120">
                  <Skeleton
                    height="100%"
                    width="100%"
                    style={{ display: "block" }}
                    className="shadow-custom rounded-custom"
                  />

                  <div className="absolute top-10 right-10">
                    <Skeleton width={100} height={35} borderRadius={50} />
                  </div>

                  <div className="absolute bottom-10 left-10">
                    <Skeleton width={140} height={20} />
                  </div>
                </div>

                <div className="absolute -inset-4 rounded-custom -z-10 blur-xl translate-x-4 translate-y-4" />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default StickyStackLoader;
