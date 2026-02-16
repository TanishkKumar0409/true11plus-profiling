import { useCallback, useEffect, useState } from "react";
import {
  getErrorResponse,
  getUserAvatar,
  showComingSoonToast,
} from "../../contexts/CallBacks";
import type { UserProps } from "../../types/UserTypes";
import { Link, useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/Types";
import { API } from "../../contexts/API";
import { BiCheck, BiMapPin, BiUserPlus } from "react-icons/bi";
import { SecondButton } from "../../ui/buttons/Button";

export const SuggestedUsers = () => {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [suggestions, setSuggestions] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const handleConnect = (id: string) => {
    showComingSoonToast();
    setConnectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getSuggestions = useCallback(async () => {
    if (!authUser?._id) return;
    try {
      setLoading(true);
      const response = await API.get(`/user/random/${authUser?._id}`);
      setSuggestions(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [authUser?._id]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  if (loading && suggestions.length === 0) {
    return (
      <div className="p-6 text-center text-(--gray) animate-pulse">
        Finding scholars for you...
      </div>
    );
  }

  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom border border-(--gray-subtle)">
      <div className="p-6 pb-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-(--gray-emphasis)">
                People you may know
              </h3>
            </div>
            <p className="font-medium text-xs text-(--gray)">
              Recommended based on your activity
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 space-y-1">
        {suggestions.map((person, index) => {
          const personId = person._id;
          const isConnected = connectedIds.includes(personId);

          const location = [person?.city, person?.state, person?.country]
            ?.filter(Boolean)
            ?.join(", ");

          return (
            <div
              key={personId || index}
              className="group flex items-center gap-4 p-3 hover:bg-(--secondary-bg) transition-all duration-300 cursor-default rounded-custom"
            >
              <Link
                to={`${import.meta.env.VITE_FRONT_URL}/profile/${person?.username}`}
                className="shrink-0"
              >
                <img
                  src={getUserAvatar(person.avatar)}
                  alt={person.name}
                  className="w-12 h-12 rounded-full bg-(--primary-bg) border-2 border-(--main-subtle) object-cover transition-transform duration-500 group-hover:scale-105 shadow-sm"
                />
              </Link>

              <Link
                to={`${import.meta.env.VITE_FRONT_URL}/profile/${person?.username}`}
                className="flex-1 min-w-0"
              >
                <h4 className="truncate tracking-tight font-bold text-sm text-(--gray-emphasis)">
                  {person.name}
                </h4>
                <p className="text-xs font-medium truncate text-(--main-emphasis)">
                  {person.title || "Academic Candidate"}
                </p>

                {location && (
                  <div className="flex items-center gap-1 mt-1 text-(--gray) text-[10px]">
                    <BiMapPin className="w-3 h-3" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </Link>

              <button
                type="button"
                onClick={() => handleConnect(personId)}
                title={isConnected ? "Request Sent" : "Connect"}
                className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isConnected
                    ? "bg-(--success-subtle) text-(--success) border border-(--success)"
                    : "bg-(--main-subtle) text-(--main) hover:bg-(--main) hover:text-white"
                }`}
              >
                {isConnected ? (
                  <BiCheck className="w-5 h-5" />
                ) : (
                  <BiUserPlus className="w-5 h-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-3 pt-0 text-(--text-color)">
        <SecondButton
          label={"Explore More Suggestions"}
          href={`${import.meta.env.VITE_FRONT_URL}/students`}
          target="_blank"
        />
      </div>
    </div>
  );
};
