"use client";

import React from "react";
import { motion } from "framer-motion";

interface WavesComponentProps {
  count?: number;
}

export default function WavesComponent({ count = 4 }: WavesComponentProps) {
  const wavePath =
    "M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z";

  return (
    <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none overflow-hidden h-63">
      {Array.from({ length: count }).map((_, i) => {
        const speed = 30 - i * 5;
        const opacity = 0.2 + (i / count) * 0.8;
        const heightPercent = 70 + i * 10;
        const verticalOffset = (count - i - 1) * 20;

        return (
          <div
            key={i}
            className="absolute bottom-0 left-0 w-[200%] h-full"
            style={{
              height: `${heightPercent}%`,
              opacity: opacity,
              bottom: `-${verticalOffset}px`,
            }}
          >
            <motion.div
              className="flex w-full h-full"
              animate={{
                x: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"],
                y: [0, 15 - i * 2, 0],
              }}
              transition={{
                x: {
                  duration: speed,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <svg
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path fill="var(--primary-bg)" d={wavePath} />
              </svg>
              <svg
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path fill="var(--primary-bg)" d={wavePath} />
              </svg>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
