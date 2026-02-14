"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface HeadingProps {
  badgeText: string;
  badgeIcon: IconType;
  titleNormal: string;
  titleHighlight: string;
  align?: "left" | "center";
}

export default function Heading({
  badgeText,
  badgeIcon: Icon,
  titleNormal,
  titleHighlight,
  align = "left",
}: HeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`max-w-4xl ${isCentered ? "mx-auto text-center" : "text-left"}`}
    >
      {/* Animated Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex items-center gap-2 text-(--main) font-bold text-sm tracking-widest uppercase mb-4 ${
          isCentered ? "justify-center" : "justify-start"
        }`}
      >
        <Icon size={18} />
        {badgeText}
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-black text-(--text-color) tracking-tight leading-tight"
      >
        {titleNormal} <span className="text-transparent font-times-custom bg-clip-text bg-linear-to-br from-(--main) to-(--main-emphasis) ">{titleHighlight}</span>
      </motion.h2>
    </div>
  );
}
