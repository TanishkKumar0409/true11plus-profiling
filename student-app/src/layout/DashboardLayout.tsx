import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import type { UserProps } from "../types/UserTypes";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

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

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const loadingBarRef = useRef<LoadingBarRef>(null);
  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

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
      <Sidebar isCollapsed={isCollapsed} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out
        w-full ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Header
          onToggleCollapse={handleToggleSidebar}
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
