"use client";

import { API } from "@/contexts/API";
import { getErrorResponse, getUserAvatar } from "@/contexts/Callbacks";
import { ConnectionProps, UserProps } from "@/types/UserProps";
import { Button } from "@/ui/button/Button";
import ConnectionSkeleton from "@/ui/loading/components/profile/ConnectionSkeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiCheck, BiMapPin, BiUserPlus, BiLoaderAlt } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { toast } from "react-hot-toast";

interface RelatedUsersProps {
  user: UserProps | null;
  connections: ConnectionProps[];
  connectionRequests: { count: number; requests: any[] } | null;
}

export default function RelatedUsers({
  user,
  connections,
  connectionRequests,
}: RelatedUsersProps) {
  const [suggestions, setSuggestions] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingIds, setRequestingIds] = useState<string[]>([]);
  const [localRequestedIds, setLocalRequestedIds] = useState<string[]>([]);

  useEffect(() => {
    if (connectionRequests?.requests) {
      const existingRequestIds = connectionRequests.requests.map((req: any) => 
        typeof req.receiver === 'string' ? req.receiver : req.receiver?._id
      );
      setLocalRequestedIds(existingRequestIds);
    }
  }, [connectionRequests]);

  const handleConnect = async (receiverId: string) => {
    if (requestingIds.includes(receiverId) || localRequestedIds.includes(receiverId)) return;

    setRequestingIds((prev) => [...prev, receiverId]);
    try {
      await API.post(`/user/connect/request/${receiverId}`);
      setLocalRequestedIds((prev) => [...prev, receiverId]);
      toast.success("Connection request sent!");
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== receiverId));
    }
  };

  const getSuggestions = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await API.get(`/user/random/${user?._id}`);
      const filtered = response.data.filter((suggestion: UserProps) => {
        return !connections.some((conn) =>
          conn.users.includes(suggestion._id || "") && conn.status === "accepted"
        );
      });
      setSuggestions(filtered);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, connections]);

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
            <p className="font-medium paragraph text-sm">
              Recommended based on your activity
            </p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 space-y-1">
        {suggestions.map((person, index) => {
          const personId = person._id || "";
          const isRequesting = requestingIds.includes(personId);
          const hasRequested = localRequestedIds.includes(personId);
          
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
                className="shrink-0 relative w-12 h-12 rounded-full bg-(--primary-bg) border-2 border-(--border) overflow-hidden transition-transform duration-500 group-hover:scale-105 shadow-sm"
              >
                <Image
                  fill
                  src={getUserAvatar(person.avatar || [])}
                  alt={person.name || "User"}
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h4 className="truncate text-sm font-bold tracking-tight text-(--text-color-emphasis)">
                  <Link href={`/profile/${person.username}`} className="hover:text-(--main)">
                    {person.name}
                  </Link>
                </h4>

                <p className="font-medium text-xs truncate text-(--text-subtle)">
                  @{person.username}
                </p>
                {location && (
                  <div className="flex items-center gap-1 mt-0.5 text-[11px] text-(--text-subtle)">
                    <BiMapPin className="shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
              <button
                disabled={hasRequested || isRequesting}
                onClick={() => handleConnect(personId)}
                className={`
                  shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300
                  ${
                    hasRequested
                      ? "bg-(--success-subtle) text-(--success) cursor-default"
                      : isRequesting
                        ? "bg-(--secondary-bg) text-(--text-subtle) cursor-wait"
                        : "bg-(--secondary-bg) text-(--text-color) hover:bg-(--main) hover:text-white cursor-pointer border border-(--border) hover:border-transparent"
                  }
                `}
              >
                {isRequesting ? (
                  <BiLoaderAlt className="w-5 h-5 animate-spin" />
                ) : hasRequested ? (
                  <BiCheck className="w-5 h-5" />
                ) : (
                  <BiUserPlus className="w-5 h-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="p-3 pt-0">
        <Button
          variant="secondary"
          label="Explore more suggestions"
          className="w-full text-sm"
          icon={<BsArrowRight className="w-4 h-4" />}
          href="/students"
        />
      </div>
    </div>
  );
}