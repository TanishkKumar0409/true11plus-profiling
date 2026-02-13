import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import { SidbarNavigations } from "../../../../common/RouteData";

export default function SidebarSkeleton() {
  const [sidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved ? saved === "true" : false;
  });

  return (
    <div
      className={`hidden lg:flex fixed inset-y-0 left-0 bg-(--primary-bg) border-r border-(--border) transition-all duration-300 ease-in-out z-40 flex-col
          ${sidebarCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex items-center justify-start px-2 py-3 border-b border-(--border) shrink-0">
        {sidebarCollapsed ? (
          <Skeleton circle width={32} height={36} />
        ) : (
          <Skeleton width={220} height={36} />
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-3 overflow-y-auto scrollbar-none">
        <div className="space-y-4">
          {[...Array(SidbarNavigations?.length || 5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2">
              <Skeleton width={25} height={25} />
              {!sidebarCollapsed && <Skeleton width={150} height={18} />}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
