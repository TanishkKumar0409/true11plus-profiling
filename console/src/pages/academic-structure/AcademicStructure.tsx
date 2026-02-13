import { useCallback, useEffect, useState } from "react";
import type { AcademicClassProps } from "../../types/AcademicStructureType";
import Tabs from "../../ui/tabs/Tab";
import AcademicClass from "./academic-structure-components/AcademicClass";
import AcademicGroup from "./academic-structure-components/AcademicGroup";
import { FiUsers } from "react-icons/fi";
import { LuGroup } from "react-icons/lu";
import { getErrorResponse } from "../../contexts/Callbacks";
import { API } from "../../contexts/API";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/Types";
import UserListSkeleton from "../../ui/loading/pages/UserListSkeleton";

export default function AcademicStructure() {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [allAcademicClasses, setAllAcademicClassess] = useState<
    AcademicClassProps[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getAllAcademicClasses = useCallback(async () => {
    try {
      startLoadingBar();
      setLoading(true);
      const res = await API.get("/academic/class/all");
      setAllAcademicClassess(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, []);

  useEffect(() => {
    getAllAcademicClasses();
  }, [getAllAcademicClasses]);

  const tabData = [
    {
      label: "Academic Group",
      value: "academic-group",
      icon: <LuGroup />,
      component: <AcademicGroup allAcademicClasses={allAcademicClasses} />,
    },
    {
      label: "Academic Class",
      value: "academic-class",
      icon: <FiUsers />,
      component: <AcademicClass allAcademicClasses={allAcademicClasses} />,
    },
  ];

  if (loading) return <UserListSkeleton showProfile={false} />;

  return (
    <div>
      <Breadcrumbs
        title="Academic Structure"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Academic Structure" },
        ]}
      />

      <Tabs tabs={tabData} defaultTab={tabData?.[0]?.value} paramKey="tab" />
    </div>
  );
}
