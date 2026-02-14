"use client";
import Heading from "@/ui/heading/Heading";
import { motion } from "framer-motion";
import Image from "next/image";
import { BiAward } from "react-icons/bi";
import { LuStar } from "react-icons/lu";

const mentors = [
  {
    name: "Mr. Himanshu Goel",
    role: "SAT Expert",
    university: "Harvard University",
    image: "/img/mentors/himanshu-goel.webp",
    rating: "4.9",
    students: "1.2k+",
  },
  {
    name: "Mr. Gautam",
    role: "Global education counsellor with 25+ years of experience",
    university: "Stanford Graduate",
    image: "/img/mentors/gautam.webp",
    rating: "4.9",
    students: "850+",
  },
  {
    name: "Mr. Vibhutesh Kumar Singh",
    role: "Lecturer, SETU Ireland",
    university: "Oxford Alumna",
    image: "/img/mentors/vibhutesh-kumar-singh.webp",
    rating: "4.8",
    students: "2.1k+",
  },
  {
    name: "Mr. Vinamra Bansal",
    role: "NUS singapore ",
    university: "MIT Researcher",
    image: "/img/mentors/vinamra-bansal.webp",
    rating: "4.9",
    students: "940+",
  },
];

export default function MentorSection() {
  return (
    <section className="relative py-24 bg-linear-to-b from-(--tertiary-bg) to-(--primary-bg) overflow-hidden">
      <div className="sm:px-8 px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <Heading
            badgeText="World-Class Guidance"
            badgeIcon={BiAward}
            titleNormal="Learn from the"
            titleHighlight="Best Minds"
          />
          {/* <button className="hidden md:block px-8 py-3 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
            View All Mentors
          </button> */}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mentors.map((mentor, index) => (
            <MentorCard key={index} mentor={mentor} index={index} />
          ))}
        </div>

        {/* Mobile View All Button */}
        {/* <button className="w-full mt-10 md:hidden px-8 py-4 bg-slate-900 text-white rounded-xl font-bold">
          View All Mentors
        </button> */}
      </div>
    </section>
  );
}

function MentorCard({ mentor, index }: { mentor: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Image Container */}
      <div className="relative aspect-5/5 overflow-hidden rounded-custom shadow-custom">
        <Image
          fill
          src={mentor.image}
          alt={mentor.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* <div className="absolute inset-0 bg-overlay to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex justify-center gap-4 mb-4">
            <button className="py-2 px-3 bg-(--hex-subtle) backdrop-blur-md rounded-custom text-(--hex) hover:bg-(--hex) hover:text-(--hex-subtle) cursor-pointer transition-colors">
              <BsLinkedin size={18} />
            </button>
            <Button
              variant="secondary"
              label="Book Session"
              className="text-(--white)! hover:text-(--main)!"
            />
          </div>
        </div> */}

        {/* Rating Tag */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-(--primary-bg)/90 backdrop-blur-md text-(--text-color) rounded-full text-xs font-bold shadow-custom">
          <LuStar size={12} className="text-(--warning) fill-(--warning)" />
          {mentor.rating}
        </div>
      </div>

      {/* Basic Info */}
      <div className="mt-6 text-center md:text-left">
        <h3 className="text-xl font-bold text-(--text-color) group-hover:text-(--main) transition-colors">
          {mentor.name}
        </h3>
        <p className="text-(--gray)/60 font-medium text-xs mb-2">
          {mentor.role}
        </p>

        {/* <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-(--text-subtle)">
            <FaGraduationCap size={14} className="text-(--main)" />
            {mentor.university}
          </div> */}

        <div className="mt-4 pt-4 border-t border-(--border) flex items-center justify-between text-xs font-bold  tracking-wider text-(--text-subtle)">
          <span>Success Rate: 100%</span>
          <span className="text-(--main)">{mentor.students} Students</span>
        </div>
      </div>
    </motion.div>
  );
}
