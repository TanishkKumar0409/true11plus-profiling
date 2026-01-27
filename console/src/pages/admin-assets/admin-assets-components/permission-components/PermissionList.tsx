import type { Column } from "../../../../types/Types";
import type { Permission } from "../../../../types/UserProps";
import TableButton from "../../../../ui/button/TableButton";
import { SimpleTable } from "../../../../ui/table/SimpleTable";
import { BiEdit, BiPlus } from "react-icons/bi";

// }

interface PermissionListProps {
  setIsAdding: React.Dispatch<React.SetStateAction<Permission | boolean>>;
  allPermissions: Permission[];
}

export default function PermissionList({
  setIsAdding,
  allPermissions,
}: PermissionListProps) {
  const columns: Column<Permission>[] = [
    {
      label: "Title",
      value: (row) => (
        <span className="font-medium text-gray-700">{row.title}</span>
      ),
    },
    {
      label: "Action",
      value: (row) => (
        <div className="flex gap-2">
          <TableButton
            color="green"
            Icon={BiEdit}
            onClick={() => setIsAdding(row)}
            tooltip="edit permission"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/30">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage available system permissions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 transition-all active:scale-95"
        >
          <BiPlus className="text-lg" />
          Add Permission
        </button>
      </div>

      {/* Table Section */}
      <div className="p-0">
        <SimpleTable data={allPermissions} columns={columns} />
      </div>
    </div>
  );
}
