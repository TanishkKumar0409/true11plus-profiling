import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import LanguageInfoSkeleton from "@/ui/loading/components/profile/LanguageInfoSkeleton";
import React, { useCallback, useEffect, useState } from "react";
import { BiGlobe } from "react-icons/bi";

interface GlobalSkills {
  _id: string;
  skill: string;
}

export default function SkillInfo({ user }: { user: UserProps | null }) {
  const [userSkills, setUserSkills] = useState<GlobalSkills[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllSkills = useCallback(async () => {
    setLoading(true);
    if (!user?._id) return;
    try {
      const response = await API.get(`/user/skills/show/${user._id}`);

      const data = response.data;

      setUserSkills(data?.skill);
    } catch (error) {
      getErrorResponse(error, true);
      setUserSkills([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getAllSkills();
  }, [getAllSkills]);

  if (loading) return <LanguageInfoSkeleton />;
  if (!Array.isArray(userSkills) || userSkills.length <= 0) return null;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
      <div className="px-5 pt-4 flex items-center gap-2">
        <h3 className="font-semibold text-(--text-color)">Languages</h3>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3">
          {userSkills?.map((item: GlobalSkills, index: number) => (
            <div
              key={item._id || index}
              className="flex items-center gap-2 px-3 py-1.5 bg-(--secondary-bg) border border-(--border) rounded-full hover:bg-(--main-subtle) hover:border-(--main) transition"
            >
              <BiGlobe className="text-(--main)" size={16} />

              <span className="text-sm font-medium text-(--text-color)">
                {item?.skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
