import { useState } from "react";
import SidebarSkeleton from "../ui/sidebars/SidebarSkeleton";
import DashboardSkeleton from "./DashboardSkeleton";
import HeaderSkeleton from "../ui/headers/HeaderSkeleton";

export default function MainLoader() {
  const [sidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? saved === "true" : false;
  });

  return (
    <div className="min-h-screen bg-(--secondary-bg) relative flex">
      <SidebarSkeleton />
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out
        w-full ml-0 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <HeaderSkeleton />
        <div className="p-6 mt-16">
          <DashboardSkeleton />
        </div>
      </div>
    </div>
  );
}
