import { useCallback, useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "../../../ui/breadcrumbs/Breadcrumbs";
import { BiPlus } from "react-icons/bi";
import {
  getErrorResponse,
  getStatusColor,
  matchPermissions,
} from "../../../contexts/Callbacks";
import { API } from "../../../contexts/API";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import type { DashboardOutletContextProps, Column } from "../../../types/Types";
import type { TaskProps } from "../../../types/AcademicStructureType";
import { useOutletContext } from "react-router-dom";
import TableButton from "../../../ui/button/TableButton";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import { DataTable } from "../../../ui/table/DataTable";
import Badge from "../../../ui/badge/Badge";

export default function Tasks() {
  const [alltask, setAllTasks] = useState<TaskProps[]>([]);
  const { authLoading, authUser } =
    useOutletContext<DashboardOutletContextProps>();
  const getAllTask = useCallback(async () => {
    try {
      const response = await API.get(`/task/all`);
      setAllTasks(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);
  useEffect(() => {
    getAllTask();
  }, [getAllTask]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          const response = await API.delete(`/task/delete/${id}`);
          toast.success(response.data.message || "Deleted successfully");
          getAllTask();
        }
      } catch (error) {
        getErrorResponse(error);
      }
    },
    [getAllTask],
  );

  const columns = useMemo<Column<TaskProps>[]>(
    () => [
      { value: "title" as keyof TaskProps, label: "Title" },
      {
        value: (row: TaskProps) => (
          <div className="capitalize">
            {typeof row?.academic_group_id === "object"
              ? row?.academic_group_id?.academic_group
              : row?.academic_group_id}
          </div>
        ),
        label: "Group",
        sortingKey: "academic_group_id",
      },
      {
        value: (row: TaskProps) => (
          <div>
            {row?.duration?.duration_value} {row?.duration?.duration_type}
          </div>
        ),
        label: "Duration",
        sortingKey: "duration",
      },
      {
        value: (row: TaskProps) => (
          <Badge children={row?.status} variant={getStatusColor(row?.status)} />
        ),
        label: "Status",
        sortingKey: "status",
      },
      {
        label: "Actions",
        value: (row: TaskProps) => (
          <div className="flex space-x-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read Task") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    buttontype="link"
                    href={`/dashboard/task/${row._id}`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Update Task") && (
                  <TableButton
                    Icon={LuPencil}
                    color="green"
                    buttontype="link"
                    href={`/dashboard/task/${row._id}/edit`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Delete Task") && (
                  <TableButton
                    Icon={LuTrash2}
                    color="red"
                    buttontype="button"
                    onClick={() => handleDelete(row._id)}
                  />
                )}
              </>
            )}
          </div>
        ),
        key: "actions",
      },
    ],
    [handleDelete, authLoading, authUser?.permissions],
  );

  return (
    <div>
      <Breadcrumbs
        title="Tasks"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Task" },
        ]}
        extraButtons={[
          {
            label: "Create Task",
            icon: BiPlus,
            path: "/dashboard/task/create",
          },
        ]}
      />
      <DataTable<TaskProps> data={alltask} columns={columns} />
    </div>
  );
}
