import { useCallback, useEffect, useState } from "react";
import AcademicGroupList from "./academic-group-components/AcademicGroupList";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { API } from "../../../contexts/API";
import AcademicGrouCreate from "./academic-group-components/AcademicGroupCreate";
import type {
  AcademicClassProps,
  AcademicGroupProps,
} from "../../../types/AcademicStructureType";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { useOutletContext } from "react-router-dom";

export default function AcademicGroup({
  allAcademicClasses,
}: {
  allAcademicClasses: AcademicClassProps[];
}) {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [allAcademicGroups, setAllAcademicGroups] = useState<
    AcademicGroupProps[]
  >([]);
  const [isAdding, setIsAdding] = useState<AcademicGroupProps | boolean>(false);

  const getAllAcademicGroups = useCallback(async () => {
    startLoadingBar();
    try {
      const response = await API.get(`/academic/group/all`);
      setAllAcademicGroups(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      stopLoadingBar();
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
