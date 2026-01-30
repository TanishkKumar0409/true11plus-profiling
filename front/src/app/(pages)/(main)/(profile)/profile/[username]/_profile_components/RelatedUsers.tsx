import { API } from "@/contexts/API";
import {
  comingSoonToast,
  getErrorResponse,
  getUserAvatar,
} from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";

export default function RelatedUsers({ user }: { user: UserProps | null }) {
  const [suggestions, setSuggestions] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSuggestions = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await API.get(`/user/random/${user?._id}`);
      setSuggestions(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  if (!isLoading && suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
      <h4 className="font-bold text-gray-900 text-base">People you may know</h4>
      <p className="text-gray-500 text-xs mb-5 mt-1">
        Based on your skills and profile
      </p>

      <div className="space-y-5">
        {suggestions.map((person) => {
          const location = [person?.city, person?.state, person?.country]
            ?.filter(Boolean)
            ?.join(", ");

          return (
            <div
              key={person._id}
              className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <Link href={`/profile/${person.username}`} className="shrink-0">
                  <img
                    src={getUserAvatar(person.avatar || [])}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm hover:opacity-90 transition-opacity"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate hover:text-purple-600 transition-colors">
                      <Link href={`/profile/${person.username}`}>
                        {person.name}
                      </Link>
                    </h4>
                  </div>

                  <p className="text-xs text-gray-500 truncate">
                    @{person.username}
                  </p>

                  {location && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {location}
                    </p>
                  )}

                  {/* Connect Button */}
                  <button
                    onClick={() => comingSoonToast()}
                    className="mt-2.5 flex items-center space-x-1 px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200"
                  >
                    <BiUserPlus className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
