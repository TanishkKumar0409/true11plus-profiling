import { useState } from "react";
import Skeleton from "react-loading-skeleton";

export default function HeaderSkeleton() {
  const [sidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved ? saved === "true" : false;
  });

  return (
    <header
      className={`fixed top-0 right-0 bg-(--primary-bg) border-b border-(--border) py-3 flex items-center justify-between px-4 z-30 transition-all duration-300 left-0 
      ${sidebarCollapsed ? "lg:left-16" : "lg:left-64"}`}
    >
      <div className="flex items-center gap-3">
        <Skeleton width={32} height={36} /> 
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton width={32} height={36} />
        <Skeleton width={32} height={36} />
        <Skeleton width={32} height={36} />
        <Skeleton width={32} height={36} />
        <Skeleton width={100} height={36} />
      </div>
    </header>
  );
}
