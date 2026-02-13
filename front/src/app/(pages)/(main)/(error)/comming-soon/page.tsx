"use client";
import React, { useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { FaBook, FaBookOpen, FaBookmark } from "react-icons/fa6";
import { HiOutlineAcademicCap, HiOutlineSparkles } from "react-icons/hi2";

const FullPage3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-(--primary-bg) overflow-hidden flex items-center justify-center"
      style={{ perspective: "1500px" }}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(var(--main) 1px, transparent 1px), linear-gradient(90deg, var(--main) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          transform: "rotateX(60deg) translateY(-200px) translateZ(-500px)",
          transformOrigin: "top",
        }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-(--main)/10 blur-[150px] rounded-full" />
      <Floating3DObject
        Icon={FaBookOpen}
        x="-35%"
        y="-30%"
        z={100}
        rotate={15}
        color="text-(--blue)/40"
        size={140}
      />
      <Floating3DObject
        Icon={FaBookmark}
        x="30%"
        y="-35%"
        z={200}
        rotate={-20}
        color="text-(--danger)/40"
        size={90}
      />
      <Floating3DObject
        Icon={FaBook}
        x="-25%"
        y="30%"
        z={150}
        rotate={-10}
        color="text-(--warning)/40"
        size={110}
      />
      <Floating3DObject
        Icon={HiOutlineAcademicCap}
        x="35%"
        y="25%"
        z={300}
        rotate={25}
        color="text-(--main)/20"
        size={180}
      />

      <motion.main
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <motion.div
          style={{ translateZ: "120px" }}
          className="mb-10 px-6 py-2 rounded-full bg-(--primary-bg)/80 backdrop-blur-md border border-(--border) shadow-custom flex items-center gap-2"
        >
          <HiOutlineSparkles className="text-(--main) animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-(--text-color) uppercase">
            Coming Early 2026
          </span>
        </motion.div>

        <motion.div style={{ translateZ: "80px" }} className="relative">
          <h1 className="text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter text-(--text-color-emphasis) drop-shadow-sm">
            LAUNCHING <br />
            <span className="bg-clip-text text-transparent bg-linear-to-b from-(--main-emphasis) to-(--main-subtle) via-(--main) shadow-inner!">
              SOON.
            </span>
          </h1>
          <h1 className="absolute inset-0 translate-y-1 translate-x-1 -z-10 text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter text-(--text-color-emphasis)/50 blur-[2px] pointer-events-none">
            LAUNCHING <br /> SOON.
          </h1>
        </motion.div>

        <motion.p
          style={{ translateZ: "60px" }}
          className="mt-12 max-w-2xl text-xl md:text-2xl text-(--text-color) font-medium leading-relaxed"
        >
          The intelligent profiling ecosystem for students.{" "}
          <br className="hidden md:block" />
          Map your skills. Track your growth. Own your future.
        </motion.p>
      </motion.main>

      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8">
        <div className="w-1 h-32 bg-linear-to-b from-transparent via-(--main) to-transparent" />
        <span className="[writing-mode:vertical-lr] rotate-180 text-xs font-bold tracking-[0.5em] text-(--text-color) uppercase">
          Profiling System
        </span>
        <div className="w-1 h-32 bg-linear-to-b from-transparent via-(--main) to-transparent" />
      </div>
    </div>
  );
};

const Floating3DObject = ({ Icon, x, y, z, rotate, color, size }: any) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -40, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute pointer-events-none ${color}`}
      style={{
        left: `calc(50% + ${x})`,
        top: `calc(50% + ${y})`,
        translateZ: z,
        rotateZ: rotate,
        filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.05))",
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
};
export default FullPage3D;
