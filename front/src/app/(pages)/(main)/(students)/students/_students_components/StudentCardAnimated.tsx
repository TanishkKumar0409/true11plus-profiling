"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/ui/button/Button";
import { UserProps } from "@/types/UserProps";
import { getUserAvatar } from "@/contexts/Callbacks";
import { TiltWrapper } from "@/ui/animations/TiltWrapper";
import Image from "next/image";

interface StudentCardProps {
  student: UserProps;
  index: number;
}

export const StudentCardAnimated = ({ student, index }: StudentCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }}
      className="flex flex-col h-full"
    >
      <TiltWrapper className="relative w-full h-full flex flex-col rounded-custom bg-(--primary-bg) shadow-custom transition-shadow duration-500 cursor-pointer overflow-hidden p-6 group">
        {/* Banner - Fixed height to prevent layout shifts */}
        <div
          style={{ transform: "translateZ(-10px)" }}
          className="absolute top-0 left-0 w-full h-32 overflow-hidden -z-10"
        >
          {student.banner?.[0] ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${student.banner[0]}`}
              fill
              className="w-full h-full object-cover opacity-40 grayscale-50"
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-(--main-subtle) opacity-20"></div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--primary-bg)/50 to-(--primary-bg)" />
        </div>

        {/* Profile Info */}
        <div
          className="flex items-center gap-4 mb-5 mt-10"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="rounded-custom shadow-custom shrink-0">
            <div className="bg-(--primary-bg) w-16 h-16 relative rounded-custom border-3 border-(--border) overflow-hidden">
              <Image
                src={getUserAvatar(student?.avatar || [])}
                fill
                className="rounded-custom bg-(--secondary-bg) object-cover"
                alt={student.name}
              />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-(--text-color-emphasis) capitalize text-lg truncate">
              {student.name}
            </h3>
            <span className="text-xs font-bold text-(--main) mt-1 truncate">
              @{student.username}
            </span>
          </div>
        </div>

        {/* Bio Section - Grow to fill space */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="grow flex flex-col"
        >
          {student?.about && (
            <p className="paragraph font-medium text-sm line-clamp-3">
              {student.about}
            </p>
          )}
        </div>

        {/* Action - Forced to bottom */}
        <div
          style={{ transform: "translateZ(60px)" }}
          className="mt-6 pt-2"
        >
          <Button
            label="View Portfolio"
            href={`/profile/${student?.username}`}
            className="w-full"
          />
        </div>
      </TiltWrapper>
    </motion.div>
  );
};