"use client";

import { getUserAvatar, getErrorResponse } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import { ConnectionProps, UserProps } from "@/types/UserProps";
import { Button } from "@/ui/button/Button";
import ShareModal from "@/ui/modals/ShareModal";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import {
  BiMapPin,
  BiShareAlt,
  BiUserPlus,
  BiLoaderAlt,
  BiCheck,
  BiUserMinus,
  BiGroup,
} from "react-icons/bi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function BasicInfo({
  user,
  authUser,
  connections,
  connectionRequests,
}: {
  connections: ConnectionProps[];
  user: UserProps | null;
  authUser: UserProps | null;
  connectionRequests: { count: number; requests: any[] } | null;
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [localRequestedIds, setLocalRequestedIds] = useState<string[]>([]);
  const [requestingIds, setRequestingIds] = useState<string[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const hasExistingRequest = useMemo(() => {
    if (!user?._id || !connectionRequests?.requests) return false;
    return connectionRequests.requests.some(
      (req) => req.receiver._id === user?._id || req.receiver === user?._id,
    );
  }, [user?._id, connectionRequests]);

  const viewerConnection = useMemo(() => {
    if (!user?._id || !connections || removedIds.includes(user._id))
      return null;
    return connections.find((conn) => conn.users.includes(user._id));
  }, [user?._id, connections, removedIds]);

  const totalConnectionsCount = connections?.length || 0;

  const location = [user?.city, user?.state, user?.country]
    ?.filter(Boolean)
    ?.join(", ");

  const profileUrl =
    typeof window !== "undefined" && user?.username
      ? `${window.location.origin}/profile/${user?.username}`
      : "";

  const handleConnect = async (receiverId: string) => {
    setRequestingIds((prev) => [...prev, receiverId]);
    try {
      await API.post(`/user/connect/request/${receiverId}`);
      setLocalRequestedIds((prev) => [...prev, receiverId]);
      setRemovedIds((prev) => prev.filter((id) => id !== receiverId));
      toast.success("Connection request sent!");
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== receiverId));
    }
  };

  const handleDisconnect = async (receiverId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will need to send a new request to connect again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--main)",
      cancelButtonColor: "var(--text-subtle)",
      confirmButtonText: "Yes, remove connection",
      background: "var(--primary-bg)",
      color: "var(--text-color)",
    });

    if (!result.isConfirmed) return;

    setRequestingIds((prev) => [...prev, receiverId]);
    try {
      await API.delete(`/user/connect/remove/${receiverId}`);
      setRemovedIds((prev) => [...prev, receiverId]);
      setLocalRequestedIds((prev) => prev.filter((id) => id !== receiverId));
      toast.success("Connection removed.");
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== receiverId));
    }
  };

  const isRequesting = user?._id ? requestingIds.includes(user._id) : false;

  // 2. Combine Local UI state with Server-fetched state
  const hasSentLocalRequest = user?._id
    ? localRequestedIds.includes(user._id)
    : false;

  const isAccepted = viewerConnection?.status === "accepted";

  const isPending =
    (viewerConnection?.status === "pending" ||
      hasSentLocalRequest ||
      hasExistingRequest) &&
    !isAccepted &&
    !removedIds.includes(user?._id || "");

  return (
    <div className="flex items-start justify-center bg-(--secondary-bg)">
      <div className="w-full max-w-sm bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden">
        <div className="aspect-2/1 w-full relative bg-linear-to-b from-(--main) to-(--main-emphasis)">
          {user?.banner?.[0] && (
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${user?.banner?.[0]}`}
              alt="Banner"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="px-6 pb-8">
          <div className="flex justify-between items-start">
            <div className="relative -mt-8">
              <div className="w-18 h-18 rounded-full border-4 border-(--border) overflow-hidden bg-(--white) shadow-custom relative">
                <Image
                  src={getUserAvatar(user?.avatar || [])}
                  alt={user?.name || "Profile Picture"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              {authUser?._id !== user?._id && (
                <Button
                  label={
                    isRequesting
                      ? "Processing..."
                      : isAccepted
                        ? "Unconnect"
                        : isPending
                          ? "Requested"
                          : "Connect"
                  }
                  variant={isAccepted ? "secondary" : "primary"}
                  icon={
                    isRequesting ? (
                      <BiLoaderAlt className="animate-spin" size={18} />
                    ) : isAccepted ? (
                      <BiUserMinus size={18} />
                    ) : isPending ? (
                      <BiCheck size={18} />
                    ) : (
                      <BiUserPlus size={18} />
                    )
                  }
                  disabled={
                    isRequesting || !user?._id || (isPending && !isAccepted)
                  }
                  onClick={() => {
                    if (!user?._id) return;
                    isAccepted
                      ? handleDisconnect(user._id)
                      : handleConnect(user._id);
                  }}
                  className={`flex gap-2 items-center py-1! px-4! ${
                    isPending
                      ? "bg-(--success-subtle)! text-(--success)! border-(--success)!"
                      : isAccepted
                        ? "hover:bg-red-500! hover:text-white! border-transparent!"
                        : ""
                  }`}
                />
              )}
              <Button
                hideText
                icon={<BiShareAlt size={20} />}
                variant="secondary"
                onClick={() => setIsShareModalOpen(true)}
                className="flex gap-2 items-center py-1! px-4!"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-(--text-color) tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-(--main) font-semibold text-sm">
                  @{user?.username}
                </p>
              </div>

              <div className="flex flex-col items-end group cursor-pointer">
                <div className="flex items-center gap-1.5 bg-(--secondary-bg) px-3 py-1 rounded-full border border-(--border) transition-all duration-200 group-hover:border-(--main)">
                  <BiGroup
                    className="text-(--text-subtle) group-hover:text-(--main)"
                    size={16}
                  />
                  <span className="font-bold text-sm text-(--text-color)">
                    {totalConnectionsCount}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-(--text-subtle) mt-1 pr-1">
                  Connections
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4">
              {location && (
                <div className="flex items-center gap-1.5">
                  <BiMapPin size={16} className="text-(--text-subtle)" />
                  <span className="text-sm text-(--text-subtle)">
                    {location}
                  </span>
                </div>
              )}
            </div>

            {user?.title && (
              <p className="text-(--text-color) font-medium text-md mt-3 border-l-2 border-(--main) pl-3">
                {user.title}
              </p>
            )}

            {user?.about && (
              <p className="text-(--text-subtle) text-sm mt-3 leading-relaxed line-clamp-3">
                {user.about}
              </p>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postUrl={profileUrl}
      />
    </div>
  );
}
