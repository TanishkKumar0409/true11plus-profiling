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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-6 h-full"
      style={{ perspective: "1000px" }}
    >
      <TiltWrapper className="relative w-full h-full flex flex-col rounded-custom bg-(--primary-bg) shadow-custom transition-shadow duration-500 cursor-pointer overflow-hidden p-6">
        {/* Banner */}
        <div
          style={{ transform: "translateZ(-10px)" }}
          className="absolute top-0 left-0 w-full aspect-2/1 overflow-hidden -z-10"
        >
          {student.banner?.[0] ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${student.banner[0]}`}
              fill
              className="w-full h-full object-cover opacity-40 grayscale-50 "
              alt=""
            />
          ) : (
            <div className="w-full h-full opacitybg-(--main-subtle)"></div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-(transparent) via-(--primary-bg)/50 to-(--primary-bg)" />
        </div>

        <div
          className="flex items-center gap-4 mb-5"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className={`rounded-custom shadow-custom`}>
            <div className="bg-(--primary-bg) w-16 h-16 relative rounded-custom border-3 border-(--border)">
              <Image
                src={getUserAvatar(student?.avatar || [])}
                fill
                className="rounded-custom bg-(--secondary-bg)"
                alt={student.name}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-(--text-color-emphasis) capitalize text-lg">
              {student.name}
            </h3>
            <span className="text-xs font-bold text-(--main) mt-1">
              {student.username}
            </span>
          </div>
        </div>

        <div
          style={{ transform: "translateZ(25px)" }}
          className="grow space-y-2"
        >
          {student?.about && (
            <p className="paragraph font-medium">
              {student?.about?.slice(0, 100)}
              {student.about.length > 100 ? "..." : ""}
            </p>
          )}
        </div>

        <motion.div
          style={{ transform: "translateZ(60px)" }}
          className="mt-6 pt-2"
        >
          <Button
            label="View Portfolio"
            href={`/profile/${student?.username}`}
            className="w-full"
          />
        </motion.div>
      </TiltWrapper>
    </motion.div>
  );
};
