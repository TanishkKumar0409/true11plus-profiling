import type { Column } from "../../../types/Types";
import { SimpleTable } from "../../../ui/table/SimpleTable";
import type { AcademicClassProps } from "../../../types/AcademicStructureType";

export default function AcademicClass({
  allAcademicClasses,
}: {
  allAcademicClasses: AcademicClassProps[];
}) {
  const columns: Column<AcademicClassProps>[] = [
    {
      label: "Academic Class",
      value: "academic_class",
    },
  ];

  return (
    <div>
      <SimpleTable data={allAcademicClasses} columns={columns} />
    </div>
  );
}
