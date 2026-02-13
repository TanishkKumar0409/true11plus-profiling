"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/ui/button/Button";
import WavesComponent from "../../../../ui/animations/WavesComponent";
import BlobImage from "@/ui/animations/BlogImage";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-(--main-subtle) via-(--main-subtle) to-(--main)">
      <div className="relative z-20 container mx-auto flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 py-12 lg:py-0 gap-16">
        <div className="flex-1 text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl capitalize lg:text-8xl font-black text-(--text-color-emphasis) leading-[1.1] tracking-tight">
              Design your <br />
              <span className="italic bg-linear-to-b from-(--main-emphasis) to-(--main) bg-clip-text text-transparent relative">
                future self.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 15C50 5 150 5 295 15"
                    stroke="var(--main)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-lg text-lg md:text-xl text-(--text- ) leading-relaxed font-medium"
          >
            Get direct guidance from experts who’ve already made it. Document
            your journey, build a standout profile, and complete real-world
            tasks assigned by your mentor to unlock doors to the world's top
            universities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <Button
              label="Start Your Journey"
              className="px-8 py-4 text-lg transition-all"
            />
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center items-center w-full relative">
          <div className="relative w-full max-w-125 aspect-square">
            <BlobImage imageSrc="/img/background/hero-image.png" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-10">
        <WavesComponent />
      </div>
    </div>
  );
}
