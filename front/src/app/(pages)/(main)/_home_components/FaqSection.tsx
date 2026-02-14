"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiMinus, BiPlus } from "react-icons/bi";
import { LuSparkles } from "react-icons/lu";
import { trueFaqs } from "@/common/FaqData";
import { trueTestimonials } from "@/common/TestimonialsData";
import Image from "next/image";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 bg-(--primary-bg) overflow-hidden">
      <div className="sm:px-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--main-subtle) text-(--main) font-bold text-xs uppercase tracking-widest mb-6">
              <LuSparkles size={14} />
              Knowledge Base
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-(--text-color) leading-[1.1] tracking-tighter">
              Answers to your <br />
              <span className="text-main-gradient italic font-times-custom">
                Big Questions
              </span>
            </h2>

            <p className="mt-8 text-sm text-(--text-subtle) font-medium max-w-md">
              Everything you need to know about starting your global education
              journey with True11Plus.
            </p>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {trueTestimonials?.map((student, idx) => (
                  <div
                    key={idx}
                    className="relative w-12 h-12 rounded-full border-4 border-(--border) bg-(--secondary-bg) shadow-custom overflow-hidden"
                    style={{ zIndex: 5 - idx }}
                  >
                    <Image
                      fill
                      src={student?.img}
                      alt={student.name || "Student"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-(--text-color)">
                <span className="text-(--text-color-emphasis) font-bold">
                  45+ students
                </span>
                <br />
                selected in last 2 years.
              </p>
            </div>
          </motion.div>

          <div className="space-y-4">
            {trueFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group rounded-custom transition-all shadow-custom duration-300 ${
                  activeIndex === index
                    ? "ring-2! ring-(--main)! bg-(--main-subtle) shadow-custom"
                    : "bg-(--secondary-bg)"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 text-left outline-none cursor-pointer"
                >
                  <span
                    className={`md:text-md font-bold transition-colors ${activeIndex === index ? "text-(--main)" : "text-(--text-color)"}`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-full transition-all duration-300 shrink-0 ${
                      activeIndex === index
                        ? "bg-(--main) text-(--primary-bg) rotate-180"
                        : "bg-(--primary-bg) text-(--text-subtle) shadow-sm"
                    }`}
                  >
                    {activeIndex === index ? (
                      <BiMinus size={20} />
                    ) : (
                      <BiPlus size={20} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-6 text-(--text-color) text-sm pt-0 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
