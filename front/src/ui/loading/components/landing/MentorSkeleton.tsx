"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

const MentorSkeleton = () => {
  // Array of 4 items for the skeleton cards
  const cards = Array(4).fill(0);

  return (
    <section className="w-full py-16 px-4 md:px-8">
      <div className="mb-12">
        <div className="mb-4">
          <Skeleton width={220} height={20} borderRadius={4} />
        </div>
        <div className="max-w-xl">
          <Skeleton height={48} width="80%" className="mb-2" />
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {cards.map((_, index) => (
          <div key={index} className="flex flex-col group">
            <div className="relative mb-6">
              <Skeleton
                className="aspect-square w-full rounded-custom"
                containerClassName="block w-full"
              />
              {/* Floating Badge Mockup (Top Right) */}
              <div className="absolute top-4 right-4">
                <Skeleton width={50} height={24} borderRadius={20} />
              </div>
            </div>

            {/* Mentor Info */}
            <div className="space-y-2 ">
              <Skeleton width="70%" height={24} />
              <Skeleton width="45%" height={16} />
            </div>

            {/* Horizontal Divider */}
            <div className="w-full mb-2">
              <Skeleton height={2} width="100%" />
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <Skeleton width={80} height={12} />
              </div>
              <div className="flex flex-col items-end">
                <Skeleton width={100} height={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorSkeleton;
