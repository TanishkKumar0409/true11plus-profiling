import { API } from "@/contexts/API";
import {
  comingSoonToast,
  getErrorResponse,
  getUserAvatar,
} from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import React, { useCallback, useEffect, useState } from "react";
import { BiMapPin, BiUserPlus } from "react-icons/bi";

interface SkillItem {
  skill: string;
}

interface GlobalLanguage {
  _id: string;
  language: string;
}

interface UserLanguage {
  _id?: string;
  languageId?: string;
  language?: string;
}

export default function BasicInfo({ user }: { user: UserProps | null }) {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);
  const [allLanguages, setAllLanguages] = useState<GlobalLanguage[]>([]);

  const getAllLanguages = useCallback(async () => {
    try {
      const response = await API.get(`/languages`);
      setAllLanguages(response.data);
    } catch (error) {
      console.error("Failed to fetch global languages", error);
    }
  }, []);

  useEffect(() => {
    getAllLanguages();
  }, [getAllLanguages]);

  const getLanguageById = useCallback(
    (id?: string) => {
      if (!id) return null;
      const lang = allLanguages.find((item) => item._id === id);
      return lang?.language;
    },
    [allLanguages],
  );

  const getProfileData = useCallback(async () => {
    if (!user?._id) return;
    try {
      const [skillsRes, langRes] = await Promise.all([
        API.get(`/user/skills/${user._id}`),
        API.get(`/user/language/${user._id}`),
      ]);

      setSkills(skillsRes.data);
      setUserLanguages(langRes.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [user?._id]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const location = [user?.city, user?.state, user?.country]
    ?.filter(Boolean)
    ?.join(", ");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Banner */}
      <div
        className="h-42 bg-gray-300 relative"
        style={{
          backgroundImage: `url(${user?.banner?.[0] ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${user?.banner?.[0]}` : ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="px-5 pb-6">
        <div className="flex flex-col items-start -mt-8">
          <div className="flex justify-between w-full items-end">
            {/* Avatar */}
            <img
              src={getUserAvatar(user?.avatar || [])}
              alt={user?.name}
              className="w-18 h-18 rounded-full border-4 border-white object-cover bg-white shadow-md z-10"
            />

            {/* Action Buttons */}
            <div className="flex gap-2 mb-0">
              <button
                onClick={() => comingSoonToast()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                <BiUserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Follow</span>
              </button>
            </div>
          </div>

          {/* User Text Info */}
          <div className="mt-3 w-full">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {user?.name}
            </h3>
            <p className="text-purple-600 font-medium text-sm">
              @{user?.username}
            </p>

            {location && (
              <div className="flex items-center mt-2 text-gray-500 text-sm">
                <BiMapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-5">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200 capitalize"
                  >
                    {item.skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {userLanguages?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {userLanguages?.map((item, index) => {
                  const resolvedName =
                    getLanguageById(item.languageId) ||
                    item.language ||
                    "Unknown";

                  return (
                    <div
                      key={index}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200 capitalize"
                    >
                      {resolvedName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
