import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import type { RoleProps, UserProps } from "../types/UserProps";
import useGetStatusAndCategory from "../hooks/useGetStatusAndCategory";

const DashboardLayout = ({
  authUser,
  authLoading,
  getAuthUser,
  getRoleById,
  roles,
}: {
  authUser: UserProps | null;
  authLoading: boolean;
  getAuthUser: () => void;
  getRoleById: (id: string) => string | undefined;
  roles: RoleProps[];
}) => {
  const { allCategory, allStatus, getAllStatus, getAllCategory } =
    useGetStatusAndCategory();
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
        authUser={authUser}
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
          <Outlet
            context={{
              authUser,
              authLoading,
              getAuthUser,
              getRoleById,
              allStatus,
              allCategory,
              roles,
              getAllStatus,
              getAllCategory,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
