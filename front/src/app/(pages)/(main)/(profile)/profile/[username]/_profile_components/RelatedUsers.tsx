import { API } from "@/contexts/API";
import {
  comingSoonToast,
  getErrorResponse,
  getUserAvatar,
} from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { Button } from "@/ui/button/Button";
import ConnectionSkeleton from "@/ui/loading/components/profile/ConnectionSkeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { BiCheck, BiMapPin, BiUserPlus } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

export default function RelatedUsers({ user }: { user: UserProps | null }) {
  const [suggestions, setSuggestions] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    comingSoonToast();
  };

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

  if (isLoading) return <ConnectionSkeleton />;
  if (!isLoading && suggestions?.length <= 0) return null;

  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom">
      <div className="p-6 pb-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-md text-(--text-color-emphasis)">
                People you may know
              </h3>
            </div>
            <p className="font-medium paragraph">
              Recommended based on your activity
            </p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 space-y-1">
        {suggestions.map((person, index) => {
          const personId = person._id || "";
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
                href={`/profile/${person.username}`}
                className="shrink-0 relative w-14 h-14 rounded-full bg-(--primary-bg) border-2 border-(--main) object-cover transition-transform duration-500 group-hover:scale-105 shadow-custom"
              >
                <Image
                  fill
                  src={getUserAvatar(person.avatar || [])}
                  alt={person.name}
                  className="rounded-full"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h4 className="truncate text-xs tracking-tight text-(--text-color-emphasis)">
                  <Link href={`/profile/${person.username}`}>
                    {person.name}
                  </Link>
                </h4>

                <p className="font-medium text-xs truncate text-(--text-color)">
                  @{person.username}
                </p>
                {location && (
                  <div className="flex items-center gap-3 text-xs text-(--text-color-emphasis)">
                    <div className="flex items-center gap-1">
                      <BiMapPin className="w-3 h-3" />
                      <span>{location}</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleConnect(personId)}
                title={isConnected ? "Request Sent" : "Connect"}
                className={`
                  shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 cursor-pointer
                  ${
                    isConnected
                      ? "bg-(--success-subtle) text-(--success) scale-110"
                      : "bg-(--secondary-bg) text-(--text-color) hover:bg-(--main) hover:text-(--white)"
                  }
                `}
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
        <Button
          variant="secondary"
          label="Explore more suggestions"
          className="w-full"
          icon={<BsArrowRight className="w-4 h-4" />}
          onClick={() => comingSoonToast()}
        />
      </div>
    </div>
  );
}
