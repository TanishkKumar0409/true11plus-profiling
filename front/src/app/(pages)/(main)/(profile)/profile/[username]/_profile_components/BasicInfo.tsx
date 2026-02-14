"use client";

import { comingSoonToast, getUserAvatar } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { Button } from "@/ui/button/Button";
import ShareModal from "@/ui/modals/ShareModal";
import Image from "next/image";
import React, { useState } from "react";
import { BiMapPin, BiShareAlt } from "react-icons/bi";

export default function BasicInfo({ user }: { user: UserProps | null }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const location = [user?.city, user?.state, user?.country]
    ?.filter(Boolean)
    ?.join(", ");

  const profileUrl = user?.username
    ? `${window.location.origin}/profile/${user?.username}`
    : "";

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
              <div className="w-18 h-18 rounded-full border-4 border-(--border) overflow-hidden bg-(--white) shadow-custom">
                <Image
                  src={getUserAvatar(user?.avatar || [])}
                  alt={user?.name || "Profile Picture"}
                  fill
                  className="rounded-full border-4 border-(--border) object-cover"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <Button
                label="Follow"
                onClick={() => comingSoonToast()}
                className="flex gap-2 items-center py-1! px-4!"
              />
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
            <h1 className="text-xl font-bold text-(--text-color) tracking-tight">
              {user?.name}
            </h1>
            <p className="text-(--main) font-semibold text-sm">
              @{user?.username}
            </p>
            {location && (
              <div className="flex items-center gap-2 sub-paragraph pt-3">
                <BiMapPin size={18} className="text-(--text-subtle)" />
                <span className="text-sm">{location}</span>
              </div>
            )}

            {user?.title && (
              <p className="text-(--text-color) font-medium text-md mt-2">
                {user.title}
              </p>
            )}

            {user?.about && (
              <p className="text-(--text-subtle) text-sm mt-2 leading-relaxed">
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
