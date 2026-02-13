import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import type { RoleProps, UserProps } from "../types/UserProps";
import useGetStatusAndCategory from "../hooks/useGetStatusAndCategory";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

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
  const loadingBarRef = useRef<LoadingBarRef>(null);
  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-(--secondary-bg) relative flex">
      <LoadingBar color="var(--main)" ref={loadingBarRef} />
      <Sidebar isCollapsed={isCollapsed} authUser={authUser} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out
        w-full ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Header
          onToggleCollapse={handleToggleSidebar}
          isCollapsed={isCollapsed}
          authUser={authUser}
        />

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
              startLoadingBar,
              stopLoadingBar,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
