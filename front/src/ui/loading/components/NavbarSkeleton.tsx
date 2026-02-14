"use client";

import Skeleton from "react-loading-skeleton";

export const NavbarSkeleton = () => {
  return (
    <nav
      className="w-full border-b border-(--border) py-4 px-4 md:px-8 sticky
     top-0 z-10 bg-(--primary-bg)"
    >
      <div className="flex items-center justify-between">
        <Skeleton width={120} height={35} borderRadius={8} />
        <div className="hidden md:flex items-center space-x-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={80} height={20} />
          ))}
        </div>
        <div className="flex items-center">
          <Skeleton width={140} height={45} borderRadius={12} />
        </div>
      </div>
    </nav>
  );
};
