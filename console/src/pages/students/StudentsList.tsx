import { useState, useMemo, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { LuBadgeX, LuEye } from "react-icons/lu";
import { BiBadgeCheck } from "react-icons/bi";
import type { Column, DashboardOutletContextProps } from "../../types/Types";
import type { UserProps } from "../../types/UserProps";
import { API } from "../../contexts/API";
import {
  getErrorResponse,
  getUserAvatar,
  maskSensitive,
  getStatusColor,
  matchPermissions,
} from "../../contexts/Callbacks";

import { DataTable } from "../../ui/table/DataTable";
import Badge from "../../ui/badge/Badge";
import TableButton from "../../ui/button/TableButton";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import UserListSkeleton from "../../ui/loading/pages/UserListSkeleton";

export default function StudentList() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const {
    authUser,
    authLoading,
    getRoleById,
    startLoadingBar,
    stopLoadingBar,
  } = useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);
  const getAllUsers = useCallback(async () => {
    startLoadingBar();
    setLoading(true);
    try {
      const response = await API.get("/users/role/student");
      const data = response.data;

      const finalData = (data || []).map((user: UserProps) => {
        return { ...user, role: getRoleById(user.role) };
      });

      setUsers(finalData);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [getRoleById, authUser?.role]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const columns = useMemo<Column<UserProps>[]>(
    () => [
      {
        value: (row: UserProps) => (
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 shrink-0">
              <img
                src={getUserAvatar(row?.avatar || [])}
                alt={row?.name}
                className="w-10 h-10 rounded-full border-2 border-(--border) object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <span className="font-semibold text-(--text-color-emphasis)">
                  {row?.name}
                </span>
                {row?.verified ? (
                  <BiBadgeCheck
                    className="w-4 h-4 text-(--success)"
                    title="Verified"
                  />
                ) : (
                  <LuBadgeX
                    className="w-4 h-4 text-(--danger)"
                    title="Unverified"
                  />
                )}
              </div>
              <span className="text-xs text-(--text-color)">
                {maskSensitive(row?.email)}
              </span>
            </div>
          </div>
        ),
        label: "User",
        key: "user",
        sortingKey: "name",
      },
      {
        value: (row: UserProps) => (
          <span className="text-sm text-(--text-color) font-medium">
            @{row?.username}
          </span>
        ),
        label: "Username",
        key: "username",
        sortingKey: "username",
      },
      {
        value: (row: UserProps) => <Badge children={row?.role} />,
        label: "Role",
        key: "role",
        sortingKey: "role",
      },
      {
        value: (row: UserProps) => {
          return (
            <Badge
              children={row?.status}
              variant={getStatusColor(row?.status)}
            />
          );
        },
        label: "Status",
        key: "status",
        sortingKey: "status",
      },
      {
        label: "Actions",
        key: "actions",
        value: (row: UserProps) => (
          <div className="flex items-center gap-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read student") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    buttontype="link"
                    href={`/dashboard/student/${row._id}`}
                  />
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [authLoading, authUser],
  );

  const tabFilters = useMemo(() => {
    const uniqueOptions = (field: keyof UserProps | "role") =>
      Array.from(
        new Set(
          users
            .map((u: any) => u[field])
            .filter(Boolean)
            .map((v) => String(v)),
        ),
      );

    return [
      {
        label: "Status",
        columns: columns.map((c) => c.label),
        filterField: "state" as keyof UserProps,
        options: uniqueOptions("state"),
      },
      {
        label: "Verified",
        columns: columns.map((c) => c.label),
        filterField: "verified" as keyof UserProps,
        options: ["true", "false"],
      },
      {
        label: "Role",
        columns: columns.map((c) => c.label),
        filterField: "role" as keyof UserProps,
        options: uniqueOptions("role"),
      },
      {
        label: "City",
        columns: columns.map((c) => c.label),
        filterField: "city" as keyof UserProps,
        options: uniqueOptions("city"),
      },
      {
        label: "State",
        columns: columns.map((c) => c.label),
        filterField: "state" as keyof UserProps,
        options: uniqueOptions("state"),
      },
      {
        label: "Country",
        columns: columns.map((c) => c.label),
        filterField: "country" as keyof UserProps,
        options: uniqueOptions("country"),
      },
    ];
  }, [users, columns]);

  if (loading) return <UserListSkeleton/>

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Students"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Students" },
        ]}
      />

      <DataTable<UserProps>
        data={users}
        columns={columns}
        tabFilters={tabFilters}
        includeExportFields={["username", "name", "email", "role", "verified"]}
        searchFields={["name", "username", "email"]}
      />
    </div>
  );
}
