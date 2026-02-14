"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { RiShieldFlashLine } from "react-icons/ri";

export default function UnderConstructionToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            x: 20,
            filter: "blur(10px)",
            transition: { duration: 0.3 },
          }}
          className="fixed bottom-6 right-6 z-9999 flex items-start gap-5 bg-(--primary-bg) backdrop-blur-2xl p-6 pr-12 rounded-custom shadow-custom lg:max-w-105 overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-(--danger-subtle) rounded-full blur-3xl opacity-50" />
          <div className="relative shrink-0">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-(--danger) text-(--text-color-emphasis) shadow-lg shadow-(--danger)/30">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <RiShieldFlashLine size={28} />
              </motion.div>
            </div>
            {/* Ping Indicator */}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--danger) opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-(--danger) border-2 border-(--text-color-emphasis)"></span>
            </span>
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-(--danger) bg-(--danger-subtle) px-2 py-0.5 rounded-md">
                System Update
              </span>
            </div>

            <h4 className="text-base font-bold text-(--text-color-emphasis) leading-tight">
              True11Plus <span className="text-(--danger) font-light">/</span>{" "}
              Digital Evolution
            </h4>

            <p className="text-[13px] text-(--text-color) leading-relaxed font-medium">
              We are currently migrating to a new core infrastructure to enhance
              your learning journey. Some features may be temporarily limited.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-(--text-color-emphasis) bg-(--tertiary-bg)"
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-(--text-subtle)">
                Optimizing
              </span>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-(--text-subtle) hover:text-(--danger) transition-colors p-1"
          >
            <IoCloseOutline size={24} />
          </button>

          <div className="absolute bottom-0 left-0 h-1 bg-(--danger-subtle) w-full overflow-hidden rounded-b-2xl">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/3 bg-linear-to-r from-transparent via-(--danger) to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
