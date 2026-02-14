"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface BlobImageProps {
  imageSrc: string;
  altText?: string;
  className?: string;
}

export default function BlobImage({
  imageSrc,
  altText = "Hero Image",
  className = "",
}: BlobImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className={`relative w-full max-w-md aspect-square ${className}`}
    >
      {/* Primary Morphing Blob Container */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div
          animate={{
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "50% 50% 30% 70% / 50% 60% 40% 40%",
              "60% 40% 60% 40% / 70% 30% 50% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full bg-(--main) overflow-hidden relative"
        >
          <Image
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover scale-110"
            fill
          />
        </motion.div>
      </div>

      <motion.div
        animate={{
          rotate: 360,
          borderRadius: [
            "50% 50% 30% 70% / 50% 60% 40% 40%",
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "50% 50% 30% 70% / 50% 60% 40% 40%",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-(--main-subtle) blur-2xl -z-10 scale-110 opacity-60"
      />
    </motion.div>
  );
}
