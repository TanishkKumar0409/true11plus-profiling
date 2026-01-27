import { useCallback, useMemo } from "react";
import { API } from "../../contexts/API";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getErrorResponse, matchPermissions } from "../../contexts/Callbacks";
import { useOutletContext } from "react-router-dom";
import type {
  Column,
  DashboardOutletContextProps,
  CategoryProps,
} from "../../types/Types";
import { DataTable } from "../../ui/table/DataTable";
import TableButton from "../../ui/button/TableButton";
import { LuEye, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

export default function CategoryList() {
  const { authUser, authLoading, allCategory, getAllCategory } =
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
          const response = await API.delete(`/category/delete/${id}`);
          toast.success(response.data.message || "Deleted successfully");
          getAllCategory();
        }
      } catch (error) {
        getErrorResponse(error);
      }
    },
    [getAllCategory],
  );

  const columns = useMemo<Column<CategoryProps>[]>(
    () => [
      { value: "category_name" as keyof CategoryProps, label: "Name" },
      {
        value: "parent_category" as keyof CategoryProps,
        label: "Parent Category",
      },
      {
        label: "Actions",
        value: (row: CategoryProps) => (
          <div className="flex space-x-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read Category") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    buttontype="link"
                    href={`/dashboard/category/${row._id}`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Update Category") && (
                  <TableButton
                    Icon={LuPencil}
                    color="green"
                    buttontype="link"
                    href={`/dashboard/category/${row._id}/edit`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Delete Category") && (
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
        title="All Category"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Category" },
        ]}
        extraButtons={[
          {
            label: "Create Category",
            path: "/dashboard/category/create",
            icon: LuPlus,
          },
        ]}
      />

      <DataTable<CategoryProps> data={allCategory} columns={columns} />
    </div>
  );
}
