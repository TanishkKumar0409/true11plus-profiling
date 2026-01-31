import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { LuBadgeX, LuUsers, LuEye, LuPencil } from "react-icons/lu";
import {
  BiBadgeCheck,
  BiUserCheck,
  BiUserMinus,
  BiUserPlus,
} from "react-icons/bi";
import type { Column, DashboardOutletContextProps } from "../../types/Types";
import type { UserProps } from "../../types/UserProps";
import { API } from "../../contexts/API";
import {
  getErrorResponse,
  getUserAvatar,
  maskSensitive,
  getFieldDataSimple,
  getStatusColor,
  matchPermissions,
} from "../../contexts/Callbacks";

import { DataTable } from "../../ui/table/DataTable";
import DashboardCard from "../../ui/card/DashboardCard";
import Badge from "../../ui/badge/Badge";
import TableButton from "../../ui/button/TableButton";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

export default function UserList() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const { authUser, authLoading, getRoleById } =
    useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);
  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/users");
      const data = response.data;

      const finalData = (data || []).reduce(
        (acc: UserProps[], item: UserProps) => {
          const useritem = { ...item, role: getRoleById(item.role) };

          if (authUser?.role === "bot admin") {
            acc.push(useritem);
            return acc;
          }

          if (useritem?.role !== "bot admin") {
            acc.push(useritem);
          }

          return acc;
        },
        [],
      );

      setUsers(
        finalData?.filter((item: UserProps) => item?.role !== "student"),
      );
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [getRoleById, authUser?.role]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const roleIcons = [LuUsers, BiUserCheck, BiUserPlus, BiUserMinus];
  const cardColors = ["blue", "purple", "green", "yellow"];

  const cardData = useMemo(() => {
    return getFieldDataSimple(users, "role").map((item, index) => ({
      title: item.title,
      value: item.value,
      icon: roleIcons[index % roleIcons.length],
      iconColor: cardColors[index % cardColors.length],
      percentage: Math.round((item.value / (users.length || 1)) * 100),
    }));
  }, [users]);

  const columns = useMemo<Column<UserProps>[]>(
    () => [
      {
        value: (row: UserProps) => (
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 shrink-0">
              <img
                src={getUserAvatar(row?.avatar || [])}
                alt={row?.name}
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <span className="font-semibold text-gray-900">{row?.name}</span>
                {row?.verified ? (
                  <BiBadgeCheck
                    className="w-4 h-4 text-green-600"
                    title="Verified"
                  />
                ) : (
                  <LuBadgeX
                    className="w-4 h-4 text-red-500"
                    title="Unverified"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500">
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
          <span className="text-sm text-gray-600 font-medium">
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
                {matchPermissions(authUser?.permissions, "Read user") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    buttontype="link"
                    href={`/dashboard/user/${row._id}`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Update user") && (
                  <TableButton
                    Icon={LuPencil}
                    color="green"
                    buttontype="link"
                    href={`/dashboard/user/${row._id}/edit`}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-purple-600">
        <div className="animate-pulse">Loading Users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Users"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "User" },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardData.map((card, index) => (
          <Link key={index} to={`/dashboard/users?role=${card?.title}`}>
            <DashboardCard
              title={card?.title}
              value={card?.value}
              iconColor={card?.iconColor}
              percentage={card?.percentage}
              icon={card?.icon}
            />
          </Link>
        ))}
      </div>

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
