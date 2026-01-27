import { getStatusColor } from "../../../../contexts/Callbacks";
import type { AcademicGroupProps } from "../../../../types/AcademicStructureType";
import type { Column } from "../../../../types/Types";
import Badge from "../../../../ui/badge/Badge";
import { SimpleTable } from "../../../../ui/table/SimpleTable";
import { BiEdit, BiPlus } from "react-icons/bi";
import TableButton from "../../../../ui/button/TableButton";
import { LuSquareDashedMousePointer } from "react-icons/lu";

interface AcademicGroupistProps {
  setIsAdding: React.Dispatch<
    React.SetStateAction<AcademicGroupProps | boolean>
  >;
  allAcademicGroups: AcademicGroupProps[];
}

export default function AcademicGroupList({
  setIsAdding,
  allAcademicGroups,
}: AcademicGroupistProps) {
  const columns: Column<AcademicGroupProps>[] = [
    {
      label: "Title",
      value: (row) => <div className="capitalize">{row?.academic_group}</div>,
    },
    {
      label: "Status",
      value: (row) => (
        <div className="flex gap-2">
          <Badge children={row?.status} variant={getStatusColor(row?.status)} />
        </div>
      ),
    },
    {
      label: "Action",
      value: (row) => (
        <div className="flex gap-2">
          <TableButton
            Icon={LuSquareDashedMousePointer}
            href={`/dashboard/group/${row?._id}/sessions`}
            tooltip="Sessions"
          />
          <TableButton
            Icon={BiEdit}
            color="green"
            onClick={() => setIsAdding(row)}
            tooltip="Edit"
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
            Academic Group
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage available system academic group.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 transition-all active:scale-95"
        >
          <BiPlus className="text-lg" />
          Add Academic Group
        </button>
      </div>

      {/* Table Section */}
      <div className="p-0">
        <SimpleTable data={allAcademicGroups} columns={columns} />
      </div>
    </div>
  );
}
