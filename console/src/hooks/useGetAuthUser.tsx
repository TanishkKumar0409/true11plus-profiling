import { useState, useEffect, useCallback, useRef } from "react";
import { API } from "../contexts/API";
import { getErrorResponse } from "../contexts/Callbacks";
import type { PermissionDoc, RoleProps, UserProps } from "../types/UserProps";

export const useGetAuthUser = () => {
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  const [roles, setRoles] = useState<RoleProps[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const isMounted = useRef(false);

  const findPermissionInDocs = useCallback(
    (id: string, allPermissions: PermissionDoc[]) => {
      if (!Array.isArray(allPermissions)) return null;
      for (const doc of allPermissions) {
        const found = doc.permissions?.find(
          (perm: { _id: string }) => perm._id === id,
        );
        if (found) return found.title;
      }
      return null;
    },
    [],
  );

  const getRoleById = useCallback(
    (id: string) => {
      const rol = roles?.find((item) => item._id === id);
      return rol?.role;
    },
    [roles],
  );

  const getAuthUser = useCallback(async () => {
    setAuthLoading(true);
    try {
      const [rolesRes, permissionsRes, userRes] = await Promise.all([
        API.get("/roles"),
        API.get("/permissions"),
        API.get("/auth/user"),
      ]);

      if (!isMounted.current) return;

      const rolesData: RoleProps[] = rolesRes.data || [];
      const permissionsData: PermissionDoc[] = permissionsRes.data || [];
      const userData = userRes.data;

      setRoles(rolesData);

      const rawPermissions = Array.isArray(userData?.permissions)
        ? userData.permissions
        : [];

      const mappedPermissions = rawPermissions.map((item: string) =>
        findPermissionInDocs(item, permissionsData),
      );

      const roleName =
        rolesData.find((r) => r._id === userData?.role)?.role || null;

      setAuthUser({
        ...userData,
        permissions: mappedPermissions,
        role: roleName,
      });
    } catch (error) {
      if (isMounted.current) {
        getErrorResponse(error, true);
        setAuthUser(null);
      }
    } finally {
      if (isMounted.current) {
        setAuthLoading(false);
      }
    }
  }, [findPermissionInDocs]);

  useEffect(() => {
    isMounted.current = true;
    getAuthUser();

    return () => {
      isMounted.current = false;
    };
  }, [getAuthUser]);

  return { authUser, authLoading, getAuthUser, roles, getRoleById };
};
