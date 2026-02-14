import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import LanguageInfoSkeleton from "@/ui/loading/components/profile/LanguageInfoSkeleton";
import React, { useCallback, useEffect, useState } from "react";
import { LuLanguages } from "react-icons/lu";

interface GlobalLanguage {
  _id: string;
  language: string;
}

export default function LanguageInfo({ user }: { user: UserProps | null }) {
  const [userLanguages, setUserLanguages] = useState<GlobalLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllLanguages = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const response = await API.get(`/user/language/show/${user._id}`);

      const data = response.data;

      setUserLanguages(data?.languageId);
    } catch (error) {
      getErrorResponse(error, true);
      setUserLanguages([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getAllLanguages();
  }, [getAllLanguages]);

  if (loading) return <LanguageInfoSkeleton />;
  if (!Array.isArray(userLanguages) || userLanguages.length <= 0) return null;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
      <div className="px-5 pt-4 flex items-center gap-2">
        <h3 className="font-semibold text-(--text-color)">Languages</h3>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3">
          {userLanguages?.map((item: GlobalLanguage, index: number) => (
            <div
              key={item._id || index}
              className="flex items-center gap-2 px-3 py-1.5 bg-(--secondary-bg) border border-(--border) rounded-full hover:bg-(--main-subtle) hover:border-(--main) transition"
            >
              <LuLanguages className="text-(--main)" size={16} />

              <span className="text-sm font-medium text-(--text-color)">
                {item?.language || item.language}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
