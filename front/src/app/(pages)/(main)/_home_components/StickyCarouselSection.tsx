"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUserTie, FaPassport, FaMapLocationDot } from "react-icons/fa6";
import { Button } from "@/ui/button/Button";

const educationSections = [
  {
    id: "01",
    title: "PERSONALISED MENTORSHIP",
    subtitle: "Your Roadmap to Excellence",
    desc: "Connect with dedicated mentors who track your progress daily. No generic advice—just a tailor-made strategy designed to showcase your unique strengths to elite admission officers.",
    bg: "bg-(--primary-bg)",
    icon: <FaUserTie size={32} />,
    image:
      "/img/background/mentors.png",
    tag: "1-on-1 Support",
    label: "Step 01 — Mentorship",
    reverse: false,
  },
  {
    id: "02",
    title: "PROFILE ARCHITECT",
    subtitle: "Document Your Success Journey",
    desc: "Build a digital portfolio that tells your story. Our platform lets you track tasks, upload certifications, and visualize your growth as you transform from an applicant into a top-tier candidate.",
    bg: "bg-(--secondary-bg)",
    icon: <FaPassport size={32} />,
    image:
       "/img/background/students.png",
    tag: "Digital Portfolio",
    label: "Step 02 — Construction",
    reverse: true,
  },
  {
    id: "03",
    title: "ADMISSION SUCCESS",
    subtitle: "Gateways to Global Campus Life",
    desc: "Finalize your journey with expert review of every task assigned by your mentor. We ensure your final submission is polished, authentic, and impossible for big universities to ignore.",
    bg: "bg-slate-100",
    icon: <FaMapLocationDot size={32} />,
    image:
      "/img/background/selection-image.webp",
    tag: "Ivy League Ready",
    label: "Step 03 — Final Call",
    reverse: false,
  },
];

export default function StickyCarouselSection() {
  return (
    <div className="relative w-full bg-(--primary-bg)">
      {educationSections.map((section, index) => (
        <section
          key={index}
          className={`sticky top-10 h-screen w-full flex items-center justify-center overflow-hidden ${section?.bg}`}
          style={{ zIndex: index + 1 }}
        >
          <div className="absolute -left-10 bottom-0 opacity-10 text-[40vw] font-black text-(--text-color-emphasis) leading-none pointer-events-none select-none">
            {section?.id}
          </div>

          <div className="container mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-32 z-10">
            <motion.div
              initial={{ opacity: 0, x: section?.reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`order-2 ${section.reverse ? "lg:order-2" : "lg:order-1"}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-4 rounded-2xl bg-(--main-subtle) shadow-custom text-(--main)`}
                >
                  {section?.icon}
                </div>
                <div>
                  <p className="text-xs font-black tracking-widest text-(--text-subtle) uppercase">
                    Journey Milestones
                  </p>
                  <p className={`text-sm font-bold text-(--main)`}>
                    {section?.label}
                  </p>
                </div>
              </div>

              <h2 className="text-(--text-color-emphasis) text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
                {section?.title}
              </h2>

              <h3 className="text-lg md:text-xl italic text-(--text-color) mb-6 flex items-center gap-2">
                {section?.subtitle}
              </h3>

              <p className="text-(--text-color) text-base md:text-lg leading-relaxed max-w-md mb-8">
                {section?.desc}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  label="Start Your Journey"
                  className="px-10 shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                rotate: section?.reverse ? -2 : 2,
              }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`flex justify-center items-center order-1 ${section?.reverse ? "lg:order-1" : "lg:order-2"}`}
            >
              <div className="relative w-full max-w-xl aspect-square rounded-custom overflow-hidden border-5 border-(--border) shadow-custom">
                <img
                  src={section?.image}
                  alt={section?.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105 rounded-custom"
                />
                <div className="absolute top-4 right-4 px-4 py-1.5 bg-(--main) text-(--main-subtle) backdrop-blur-sm rounded-full shadow-md">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {section?.tag}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}
