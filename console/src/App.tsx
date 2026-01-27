import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthLayout from "./layout/AuthLayout";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoutes from "./contexts/ProtectedRoute";
import {
  AuthNavigations,
  NonSidebarNavigations,
  PublicNavigations,
  SidbarNavigations,
} from "./common/RouteData";
import { useGetAuthUser } from "./hooks/useGetAuthUser";
import PermissionContext from "./contexts/PermissionContext";
import AccessDenied from "./pages/error/AccessDenied";

function App() {
  const { authUser, authLoading, getAuthUser, getRoleById, roles } =
    useGetAuthUser();

  if (authLoading) return <>Loading Application...</>;

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
          {/* Auth & Public Routes */}
          <Route path="/" element={<AuthLayout />}>
            {AuthNavigations.map((page, index) => (
              <Route
                path={page.href}
                element={
                  <ProtectedRoutes
                    authUser={authUser}
                    authLoading={authLoading}
                  >
                    <page.component />
                  </ProtectedRoutes>
                }
                key={`auth-${index}`}
              />
            ))}
            {PublicNavigations.map((page, index) => (
              <Route
                path={page.href}
                element={
                  <ProtectedRoutes
                    authUser={authUser}
                    authLoading={authLoading}
                  >
                    <page.component />
                  </ProtectedRoutes>
                }
                key={`public-${index}`}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
