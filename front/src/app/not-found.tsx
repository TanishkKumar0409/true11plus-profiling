"use client";
import React, { useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { FaCompass, FaMap, FaCircleQuestion, FaHouse } from "react-icons/fa6";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Link from "next/link";

const NotFound = () => {
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

  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-(--primary-bg) overflow-hidden flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(var(--main) 1px, transparent 1px), linear-gradient(90deg, var(--main) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          transform: "rotateX(70deg) translateY(-100px) translateZ(-400px)",
          transformOrigin: "top",
        }}
      />

      {/* Ambient Glow */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-(--main)/10 blur-[120px] rounded-full" />

      {/* Floating 3D Elements */}
      <Floating3DObject
        Icon={FaCompass}
        x="-30%"
        y="-25%"
        z={150}
        rotate={-20}
        color="text-(--main)/30"
        size={120}
      />
      <Floating3DObject
        Icon={FaMap}
        x="35%"
        y="-20%"
        z={250}
        rotate={15}
        color="text-(--warning)/30"
        size={100}
      />
      <Floating3DObject
        Icon={FaCircleQuestion}
        x="-20%"
        y="30%"
        z={200}
        rotate={10}
        color="text-(--danger)/20"
        size={140}
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
          style={{ translateZ: "100px" }}
          className="mb-8 px-5 py-1.5 rounded-full bg-(--danger)/10 backdrop-blur-md border border-(--danger)/20 shadow-lg flex items-center gap-2"
        >
          <HiOutlineExclamationTriangle className="text-(--danger) text-lg" />
          <span className="text-xs font-bold tracking-widest text-(--danger) uppercase">
            Error 404: Path Not Found
          </span>
        </motion.div>

        <motion.div style={{ translateZ: "80px" }} className="relative">
          <h1 className="text-[15vw] md:text-[10vw] font-black leading-none tracking-tighter text-(--text-color-emphasis)">
            LOST IN <br />
            <span className="bg-clip-text text-transparent bg-linear-to-b from-(--main-emphasis) to-(--main) shadow-inner!">
              SPACE.
            </span>
          </h1>
        </motion.div>

        <motion.div style={{ translateZ: "60px" }} className="mt-8">
          <p className="max-w-xl text-lg md:text-xl text-(--text-color) font-medium leading-relaxed opacity-80">
            Even the best explorers take a wrong turn. The page you are looking
            for has drifted out of our ecosystem.
          </p>
        </motion.div>

        <motion.div style={{ translateZ: "120px" }} className="mt-12">
          <Link
            href="/"
            className="group relative flex items-center gap-3 px-8! py-4! btn-shine text-white font-bold! rounded-2xl transition-all duration-300 shadow-xl! hover:shadow-(--main)/20 hover:-translate-y-1"
          >
            <FaHouse className="text-xl! group-hover:scale-110 transition-transform" />
            <span>Return to Orbit</span>
          </Link>
        </motion.div>
      </motion.main>

      {/* Decorative Vertical Element */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8">
        <div className="w-1 h-32 bg-linear-to-b from-transparent via-(--danger) to-transparent" />
        <span className="[writing-mode:vertical-lr] text-xs font-bold tracking-[0.5em] text-(--text-color)/50 uppercase">
          Navigation Error
        </span>
        <div className="w-1 h-32 bg-linear-to-b from-transparent via-(--danger) to-transparent" />
      </div>
    </div>
  );
};

const Floating3DObject = ({ Icon, x, y, z, rotate, color, size }: any) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, 50, 0], rotateZ: [rotate, rotate + 5, rotate] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute pointer-events-none ${color}`}
      style={{
        left: `calc(50% + ${x})`,
        top: `calc(50% + ${y})`,
        translateZ: z,
        filter: "blur(1px) drop-shadow(0 20px 30px rgba(0,0,0,0.1))",
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
};

export default NotFound;
