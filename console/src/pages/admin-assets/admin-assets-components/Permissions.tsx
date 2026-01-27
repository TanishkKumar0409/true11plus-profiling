import { useCallback, useEffect, useState } from "react";
import PermissionList from "./permission-components/PermissionList";
import PermissionCreate from "./permission-components/PermissionCreate";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import type { Permission } from "../../../types/UserProps";

export default function Permissions() {
  const { roles } = useOutletContext<DashboardOutletContextProps>();
  const [isAdding, setIsAdding] = useState<Permission | boolean>(false);
  const [mainRoles, setMainRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState([]);

  const getAllPermissions = useCallback(async () => {
    try {
      const { data } = await API.get("/permissions");
      setAllPermissions(data);
    } catch (error) {
      getErrorResponse(error, false);
    }
  }, []);

  useEffect(() => {
    getAllPermissions();
  }, [getAllPermissions]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const formatted = roles.map((r: any) => ({
          value: r._id,
          label: r.role,
        }));
        setMainRoles(formatted);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, [roles]);
  return (
    <div>
      {!isAdding ? (
        <PermissionList
          setIsAdding={setIsAdding}
          allPermissions={allPermissions}
        />
      ) : (
        <PermissionCreate
          setIsAdding={setIsAdding}
          roles={mainRoles}
          isAdding={isAdding}
          getAllPermissions={getAllPermissions}
        />
      )}
    </div>
  );
}
