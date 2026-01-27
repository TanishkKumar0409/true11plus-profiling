import { useCallback, useEffect, useState } from "react";
import AcademicGroupList from "./academic-group-components/AcademicGroupList";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { API } from "../../../contexts/API";
import AcademicGrouCreate from "./academic-group-components/AcademicGroupCreate";
import type {
  AcademicClassProps,
  AcademicGroupProps,
} from "../../../types/AcademicStructureType";

export default function AcademicGroup({
  allAcademicClasses,
}: {
  allAcademicClasses: AcademicClassProps[];
}) {
  const [allAcademicGroups, setAllAcademicGroups] = useState<
    AcademicGroupProps[]
  >([]);
  const [isAdding, setIsAdding] = useState<AcademicGroupProps | boolean>(false);

  const getAllAcademicGroups = useCallback(async () => {
    try {
      const response = await API.get(`/academic/group/all`);
      setAllAcademicGroups(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  useEffect(() => {
    getAllAcademicGroups();
  }, [getAllAcademicGroups]);
  return (
    <div>
      {isAdding ? (
        <AcademicGrouCreate
          allAcademicClasses={allAcademicClasses}
          setIsAdding={setIsAdding}
          isAdding={isAdding}
          getAllAcademicGroups={getAllAcademicGroups}
        />
      ) : (
        <AcademicGroupList
          allAcademicGroups={allAcademicGroups}
          setIsAdding={setIsAdding}
        />
      )}
    </div>
  );
}
