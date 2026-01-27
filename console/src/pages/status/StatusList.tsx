import { useCallback, useMemo } from "react";
import { API } from "../../contexts/API";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getErrorResponse, matchPermissions } from "../../contexts/Callbacks";
import { useOutletContext } from "react-router-dom";
import type {
  Column,
  DashboardOutletContextProps,
  StatusProps,
} from "../../types/Types";
import { DataTable } from "../../ui/table/DataTable";
import TableButton from "../../ui/button/TableButton";
import { LuEye, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

export default function StatusList() {
  const { authUser, authLoading, allStatus, getAllStatus } =
    useOutletContext<DashboardOutletContextProps>();

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
          const response = await API.delete(`/status/delete/${id}`);
          toast.success(response.data.message || "Deleted successfully");
          getAllStatus();
        }
      } catch (error) {
        getErrorResponse(error);
      }
    },
    [getAllStatus],
  );

  const columns = useMemo<Column<StatusProps>[]>(
    () => [
      { value: "status_name" as keyof StatusProps, label: "Name" },
      { value: "parent_status" as keyof StatusProps, label: "Parent Status" },
      {
        label: "Actions",
        value: (row: StatusProps) => (
          <div className="flex space-x-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read Status") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    buttontype="link"
                    href={`/dashboard/status/${row._id}`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Update Status") && (
                  <TableButton
                    Icon={LuPencil}
                    color="green"
                    buttontype="link"
                    href={`/dashboard/status/${row._id}/edit`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Delete Status") && (
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
    <div className="space-y-6">
      <Breadcrumbs
        title="All Status"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Status" },
        ]}
        extraButtons={[
          {
            label: "Create Status",
            path: "/dashboard/status/create",
            icon: LuPlus,
          },
        ]}
      />

      <DataTable<StatusProps> data={allStatus} columns={columns} />
    </div>
  );
}
