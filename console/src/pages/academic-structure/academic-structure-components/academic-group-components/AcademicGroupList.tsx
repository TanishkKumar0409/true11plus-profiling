import { getStatusColor } from "../../../../contexts/Callbacks";
import type { AcademicGroupProps } from "../../../../types/AcademicStructureType";
import type { Column } from "../../../../types/Types";
import Badge from "../../../../ui/badge/Badge";
import { SimpleTable } from "../../../../ui/table/SimpleTable";
import { BiEdit, BiPlus } from "react-icons/bi";
import TableButton from "../../../../ui/button/TableButton";
import { ButtonGroup } from "../../../../ui/button/Button";

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
    <div className="bg-(--primary-bg) rounded-custom shadow-custom">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="font-bold text-(--text-color) ">
            Manage available system academic group.
          </p>
        </div>

        <ButtonGroup
          Icon={BiPlus}
          label="Add Academic Group"
          onClick={() => setIsAdding(true)}
        />
      </div>

      <div className="p-0">
        <SimpleTable data={allAcademicGroups} columns={columns} />
      </div>
    </div>
  );
}
