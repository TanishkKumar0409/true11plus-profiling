import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import ExperienceInfoSkeleton from "@/ui/loading/components/profile/ExperienceInfoSkeleton";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";

interface Experience {
  _id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string;
  iscurrently: boolean;
  description: string;
}

export default function ExperienceInfo({ user }: { user: UserProps | null }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getExperience = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await API.get(`user/experience/${user._id}`);
      setExperiences(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getExperience();
  }, [getExperience]);

  const groupedExperiences = useMemo(() => {
    const groups: Record<string, Experience[]> = {};
    experiences.forEach((exp) => {
      const companyKey = exp.company.trim();
      if (!groups[companyKey]) {
        groups[companyKey] = [];
      }
      groups[companyKey].push(exp);
    });
    return groups;
  }, [experiences]);

  if (isLoading) return <ExperienceInfoSkeleton />;
  if (!isLoading && experiences.length <= 0) return;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
      <div className="px-5 pt-4">
        <h3 className="font-semibold text-(--text-color)">Experience</h3>
      </div>
      <div className="p-5 space-y-5">
        {Object.entries(groupedExperiences).map(
          ([companyName, companyRoles]) => (
            <div key={companyName} className="space-y-4 ">
              <h4 className="font-bold text-(--text-color) text-sm">
                {companyName}
              </h4>

              <div className="space-y-4">
                {companyRoles.map((exp) => (
                  <div
                    key={exp._id}
                    className="space-y-1 bg-(--secondary-bg) p-3 rounded-custom shadow-custom"
                  >
                    <h5 className="text-sm font-semibold text-(--text-color)">
                      {exp.title}
                    </h5>
                    <div className="flex items-center bg-(--primary-bg) p-1 gap-1.5 text-xs text-(--main) font-medium rounded-custom">
                      <BiCalendar size={13} />
                      <span className="">
                        {exp.start_date} -{" "}
                        {exp.iscurrently ? (
                          <span className="text-(--success) font-semibold bg-(--success-subtle) px-1.5 py-0.5 rounded-custom">
                            Present
                          </span>
                        ) : (
                          exp.end_date
                        )}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-(--text-color) opacity-80 mt-2">
                        {exp.description}
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
