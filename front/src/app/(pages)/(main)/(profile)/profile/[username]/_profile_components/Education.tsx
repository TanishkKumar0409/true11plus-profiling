import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import EducationInfoSkeleton from "@/ui/loading/components/profile/EducationInfoSkeleton";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";

interface UserEducation {
  _id: string;
  student_class: string;
  school: string;
  academic_year: string;
  description: string;
  pursuing: boolean;
}

export default function EducationInfo({ user }: { user: UserProps | null }) {
  const [educations, setEducations] = useState<UserEducation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEducation = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await API.get(`user/education/${user._id}`);
      setEducations(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);

  const groupedEducations = useMemo(() => {
    const groups: Record<string, UserEducation[]> = {};
    educations.forEach((edu) => {
      const schoolKey = edu.school.trim();
      if (!groups[schoolKey]) {
        groups[schoolKey] = [];
      }
      groups[schoolKey].push(edu);
    });
    return groups;
  }, [educations]);

  if (isLoading) return <EducationInfoSkeleton />;
  if (!isLoading && educations.length <= 0) return;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
      <div className="px-5 pt-4">
        <h3 className="font-semibold text-(--text-color)">Education</h3>
      </div>

      <div className="p-5 space-y-8">
        {Object.entries(groupedEducations).map(
          ([schoolName, schoolClasses]) => (
            <div key={schoolName}>
              <h5 className="font-medium text-sm text-(--text-color) mb-4">
                {schoolName}
              </h5>

              <div className="space-y-5">
                {schoolClasses.map((edu, index) => (
                  <div
                    key={index}
                    className="space-y-2 bg-(--secondary-bg) p-2 rounded-custom shadow-custom"
                  >
                    <h5 className="text-sm  font-semibold text-(--text-color-emphasis)">
                      {edu.student_class}
                    </h5>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`px-2 py-0. flex items-center gap-1 font-medium rounded-custom ${
                          edu.pursuing
                            ? "bg-(--success-subtle) text-(--success)"
                            : "bg-(--primary-bg) text-(--main)"
                        }`}
                      >
                        {edu.pursuing ? (
                          "Pursuing"
                        ) : (
                          <>
                            <BiCalendar size={12} />
                            {edu.academic_year}
                          </>
                        )}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-(--text-color) opacity-80 mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
