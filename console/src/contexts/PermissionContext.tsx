import type { ReactNode } from "react";
import type { UserProps } from "../types/UserProps";
import { Navigate } from "react-router-dom";

type PermissionContextProps = {
  children: ReactNode;
  authLoading: boolean;
  authUser: UserProps | null;
  permission?: string | null;
};

export default function PermissionContext({
  children,
  authUser,
  permission,
  authLoading,
}: PermissionContextProps) {
  if (authLoading) {
    return <>Permission Context Loading....</>;
  }

  if (!authUser) {
    return <Navigate to="/dashboard/access-denied" />;
  }

  if (!permission) {
    return children;
  }

  if (!authUser?.permissions?.includes(permission)) {
    return <Navigate to="/dashboard/access-denied" />;
  }

  return children;
}
