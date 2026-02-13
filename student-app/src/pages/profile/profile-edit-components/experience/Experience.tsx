import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BiBriefcase,
  BiBuilding,
  BiCalendar,
  BiPencil,
  BiTrash,
} from "react-icons/bi";
import {
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import type { UserExperience } from "../../../../types/UserTypes";
import Swal from "sweetalert2";
import { ExperienceForm } from "./ExperienceForm";
import { ButtonGroup } from "../../../../ui/buttons/Button";
import { AnimatePresence } from "framer-motion";
import ProfileEditSkeleton from "../../../../ui/loading/pages/ProfileEditSkeleton";

export default function ExperienceDetails() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [experienceLoading, setExperienceLoading] = useState(true);

  const getExperience = useCallback(async () => {
    startLoadingBar();
    setExperienceLoading(true);
    if (!authUser?._id) return;
    try {
      const response = await API.get(`/user/experience/${authUser._id}`);
      setExperiences(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      stopLoadingBar();
      setExperienceLoading(false);
    }
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getExperience();
  }, [getExperience]);

  const groupedExperiences = useMemo(() => {
    const groups: Record<string, UserExperience[]> = {};

    experiences.forEach((exp) => {
      const companyKey = exp.company.trim();
      if (!groups[companyKey]) {
        groups[companyKey] = [];
      }
      groups[companyKey].push(exp);
    });

    Object.keys(groups).forEach((company) => {
      groups[company].sort((a, b) => {
        return (
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
      });
    });

    return groups;
  }, [experiences]);

  const initialValues: UserExperience = {
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    iscurrently: false,
    description: "",
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEdit = (item: UserExperience) => {
    if (item._id) {
      setEditingId(item._id);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          startLoadingBar();
          const response = await API.delete(`/user/delete/experience/${id}`);
          getSuccessResponse(response);
          getExperience();
        }
      } catch (error) {
        getErrorResponse(error);
      } finally {
        stopLoadingBar();
      }
    },
    [getExperience, startLoadingBar, stopLoadingBar],
  );

  if (experienceLoading) return <ProfileEditSkeleton />;

  return (
    <div className="w-full bg-(--primary-bg) rounded-custom shadow-custom p-6">
      <div className="flex justify-between items-center mb-8 border-b border-(--border) pb-4">
        <div>
          <p className="font-medium text-(--text-color)">
            Update your personal details and contact information
          </p>
        </div>
        {!isEditing && (
          <ButtonGroup label="Add Experience" onClick={handleAddNew} />
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <ExperienceForm
            getExperience={getExperience}
            setIsEditing={setIsEditing}
            editingId={editingId}
            setEditingId={setEditingId}
            onCancel={handleCancel}
            initialData={
              editingId
                ? experiences.find((ex) => ex._id === editingId) ||
                  initialValues
                : initialValues
            }
          />
        )}
      </AnimatePresence>

      {/* --- LIST SECTION (GROUPED) --- */}
      <div className="space-y-8">
        {Object.keys(groupedExperiences).length === 0 && !isEditing ? (
          <div className="text-center py-14 px-6 space-y-3 border-2 border-dashed border-(--border) transition-all hover:border-(--main) rounded-custom">
            <div className="flex justify-center">
              <BiBriefcase className="w-12 h-12 text-(--main)" />
            </div>

            <h4>No Experience Added Yet</h4>

            <div className="flex justify-center">
              <ButtonGroup label="Add Experience" onClick={handleAddNew} />
            </div>
          </div>
        ) : (
          Object.entries(groupedExperiences).map(
            ([companyName, companyRoles], groupIndex) => (
              <div
                key={groupIndex}
                className="relative pl-6 border-l-2 border-(--border) ml-3"
              >
                <div className="absolute -left-7 top-0 bg-(--white) p-1">
                  <div className="w-10 h-10 rounded-full bg-(--main) flex items-center justify-center">
                    <BiBuilding className="text-(--white) w-6 h-6" />
                  </div>
                </div>
                <div className="px-4 py-2">
                  <h3 className="text-lg font-bold text-(--text-color) mb-4">
                    {companyName}
                  </h3>
                </div>

                <div className="space-y-6">
                  {companyRoles.map((role, roleIndex) => (
                    <div key={roleIndex} className="group relative">
                      <div className="flex justify-between items-start bg-(--secondary-bg) p-4 rounded-lg shadow-sm">
                        <div>
                          <h4 className="font-semibold group-hover:text-(--main)! transition-colors">
                            {role.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 paragraph">
                            <BiCalendar className="text-(--main) h-4 w-4" />
                            <span>
                              {role.start_date} —{" "}
                              {role.iscurrently ? "Present" : role.end_date}
                            </span>
                          </div>

                          {role.description && (
                            <p className="mt-2 max-w-2xl sub-paragraph">
                              {role.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(role)}
                            className="p-2 text-(--main) hover:text-(--white) bg-(--main-subtle) hover:bg-(--main) rounded-custom shadow-custom"
                            title="Edit Role"
                          >
                            <BiPencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(role._id || "")}
                            className="p-2 text-(--danger) hover:text-(--white) bg-(--danger-subtle) hover:bg-(--danger) rounded-custom shadow-custom"
                            title="Delete Role"
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
