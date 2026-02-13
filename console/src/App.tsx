import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoutes from "./contexts/ProtectedRoute";
import { NonSidebarNavigations, SidbarNavigations } from "./common/RouteData";
import { useGetAuthUser } from "./hooks/useGetAuthUser";
import PermissionContext from "./contexts/PermissionContext";
import AccessDenied from "./pages/error/AccessDenied";
import { useEffect } from "react";
import NotFound from "./pages/error/NotFound";
import ComingSoon from "./pages/error/CommingSoon";
import MainLoader from "./ui/loading/pages/MainLoader";

function App() {
  const { authUser, authLoading, getAuthUser, getRoleById, roles } =
    useGetAuthUser();

  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        window.location.href = import.meta.env.VITE_FRONT_URL;
      }
      if (authUser?.role === "student") {
        window.location.href = import.meta.env.VITE_FRONT_URL;
      }
    }
  }, [authUser?.role, authLoading]);

  if (authLoading) return <MainLoader />;

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                authLoading={authLoading}
                authUser={authUser}
                getAuthUser={getAuthUser}
                getRoleById={getRoleById}
                roles={roles}
              />
            }
          >
            {SidbarNavigations.map((page, index) => (
              <Route
                path={page.href}
                element={
                  <ProtectedRoutes
                    authUser={authUser}
                    authLoading={authLoading}
                  >
                    <PermissionContext
                      authUser={authUser}
                      authLoading={authLoading}
                      permission={page.permission}
                    >
                      <page.component />
                    </PermissionContext>
                  </ProtectedRoutes>
                }
                key={`sidebar-${index}`}
              />
            ))}
            {NonSidebarNavigations.map((page, index) => (
              <Route
                path={page.href}
                element={
                  <ProtectedRoutes
                    authUser={authUser}
                    authLoading={authLoading}
                  >
                    <PermissionContext
                      authUser={authUser}
                      authLoading={authLoading}
                      permission={page.permission}
                    >
                      <page.component />
                    </PermissionContext>
                  </ProtectedRoutes>
                }
                key={`non-sidebar-${index}`}
              />
            ))}
            <Route path="/dashboard/access-denied" element={<AccessDenied />} />
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/comming-soon" element={<ComingSoon />} />
          <Route path="/" element={<Navigate to={`/dashboard`} replace />} />
          <Route path="*" element={<Navigate to={`/not-found`} replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
