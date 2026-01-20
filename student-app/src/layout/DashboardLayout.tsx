import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import type { UserProps } from "../types/UserTypes";

const DashboardLayout = ({
  authUser,
  authLoading,
  getAuthUser,
}: {
  authUser: UserProps | null;
  authLoading: boolean;
  getAuthUser: () => void;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex">
      <Sidebar
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        closeMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out
        w-full ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Header
          toggleSidebar={handleToggleSidebar}
          isCollapsed={isCollapsed}
          authUser={authUser}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 mt-16 w-full max-w-full">
          <Outlet context={{ authUser, authLoading, getAuthUser }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
