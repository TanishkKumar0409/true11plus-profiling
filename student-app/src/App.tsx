import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NonSidebarNavigations, SidbarNavigations } from "./common/RouteData";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layout/DashboardLayout";
import { useCallback, useEffect, useState } from "react";
import type { RoleProps, UserProps } from "./types/UserTypes";
import { API } from "./contexts/API";
import { getErrorResponse } from "./contexts/CallBacks";
import NotFound from "./pages/error/NotFound";
import ComingSoon from "./pages/error/CommingSoon";
import { SkeletonTheme } from "react-loading-skeleton";
import MainLoader from "./ui/loading/pages/MainLoader";

function App() {
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roles, setRoles] = useState<RoleProps[]>([]);

  const getRoles = useCallback(async () => {
    try {
      const response = await API.get(`/roles`);
      setRoles(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const getRoleById = useCallback(
    (id: string) => {
      const rol = roles?.find((item) => item._id === id);
      return rol?.role;
    },
    [roles],
  );

  const getAuthUser = useCallback(async () => {
    if (loadingRoles) return;
    setAuthLoading(true);
    try {
      const response = await API.get(`/auth/user`);
      const data = response.data;

      setAuthUser({
        ...data,
        role: getRoleById(data?.role),
      });
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setAuthLoading(false);
    }
  }, [getRoleById, loadingRoles]);

  useEffect(() => {
    getAuthUser();
  }, [getAuthUser]);

  useEffect(() => {
    if (authLoading) return;
    const frontUrl = import.meta.env.VITE_FRONT_URL;
    if (!authLoading && (!authUser || authUser.role !== "student")) {
      console.log(authUser);
      window.location.replace(frontUrl);
    }
  }, [authLoading, authUser]);

  if (authLoading) return <MainLoader/>;

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <SkeletonTheme>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardLayout
                  authUser={authUser}
                  authLoading={authLoading}
                  getAuthUser={getAuthUser}
                />
              }
            >
              {SidbarNavigations?.map((page, index) => (
                <Route
                  path={page.href}
                  element={<page.component />}
                  key={index}
                />
              ))}
              {NonSidebarNavigations?.map((page, index) => (
                <Route
                  path={page.href}
                  element={<page.component />}
                  key={index}
                />
              ))}
              <Route path="/not-found" element={<NotFound />} />
              <Route path="/comming-soon" element={<ComingSoon />} />
              <Route
                path="*"
                element={<Navigate to={`/not-found`} replace />}
              />
            </Route>
          </Routes>
        </SkeletonTheme>
      </BrowserRouter>
    </>
  );
}

export default App;
