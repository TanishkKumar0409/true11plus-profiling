"use client";

import { true11SocialMedia } from "@/common/SocialMediaData";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/comming-soon" },
      { name: "Students", href: "/students" },
      { name: "Success Stories", href: "/comming-soon" },
      { name: "Contact Us", href: "/contact" },
    ],
    services: [
      { name: "UK Admissions", href: "/comming-soon" },
      { name: "US University Roadmap", href: "/comming-soon" },
      { name: "Visa Assistance", href: "/comming-soon" },
      { name: "Scholarship Support", href: "/comming-soon" },
    ],
    offices: ["London, UK", "New York, US", "New Delhi, IN"],
  };

  return (
    <footer className="w-full bg-(--primary-bg) pt-32 pb-12 overflow-hidden relative">
      <div className="w-full px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-20">
          <div className="space-y-8 max-w-5xl">
            <div className="flex items-center gap-4 text-sm font-bold tracking-[0.3em] text-(--main) uppercase">
              <span>Future Focused</span>
              <span className="w-12 h-px bg-(--main)/30"></span>
              <span>Global Reach</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-(--text-color-emphasis) leading-[1.1] tracking-tight">
              True11Plus
            </h2>
            <p className="text-(--text-color)">
              True11plus coaching institute helps students prepare for entrance
              exams to international boarding schools. With personalized
              attention, experienced teachers, and regular assessments, the
              institute aims to equip students with the knowledge and skills
              needed for success in these exams.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-6">
            <div className="flex gap-4">
              {true11SocialMedia.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial="initial"
                    whileHover="hover"
                  >
                    {/* Tooltip */}
                    <motion.span
                      variants={{
                        initial: { opacity: 0, y: 10, scale: 0.8 },
                        hover: { opacity: 1, y: -5, scale: 1 },
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-(--secondary-bg) text-(--text-color-emphasis) text-[10px] font-bold uppercase tracking-widest rounded-md pointer-events-none whitespace-nowrap z-50 shadow-xl shadow-black/10"
                    >
                      {item.label}
                      {/* Tooltip Arrow */}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--secondary-bg) rotate-45" />
                    </motion.span>

                    {/* Social Icon Link */}
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ y: 0 }}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                      whileHover={{
                        scale: 1.15,
                        color: "var(--main)",
                        y: -12,
                        rotate: 12,
                      }}
                      className={`w-14 h-14 flex items-center justify-center  rounded-full hover:ring-2 hover:ring-[${item?.color}]! transition-all bg-(--tertiary-bg) backdrop-blur-sm shadow-sm hover:rotate-12`}
                      style={{ color: item?.color }}
                      aria-label={item.label}
                    >
                      <IconComponent size={22} />
                    </motion.a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-20 pb-15 border-t border-(--border)">
          <div className="space-y-8">
            <p className="text-xs font-black uppercase tracking-widest text-(--text-subtle)">
              Our Expertise
            </p>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-(--text-color) hover:text-(--main) transition-colors text-lg font-medium"
                  >
                    {link.name}
                    <HiArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-(--main)" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <p className="text-xs font-black uppercase tracking-widest text-(--text-subtle)">
              Explore
            </p>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-(--text-color) hover:text-(--main) transition-colors text-lg font-medium"
                  >
                    {link.name}
                    <HiArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-(--main)" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Presence */}
          <div className="space-y-8">
            <p className="text-xs font-black uppercase tracking-widest text-(--text-subtle)">
              Global Presence
            </p>
            <ul className="space-y-4">
              {footerLinks.offices.map((office) => (
                <li
                  key={office}
                  className="text-lg text-(--text-color) flex items-center gap-3 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-(--main) animate-pulse" />
                  {office}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-8">
            <p className="text-xs font-black uppercase tracking-widest text-(--text-subtle)">
              Direct Access
            </p>
            <div className="space-y-6">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                className="block group w-fit"
              >
                <span className="text-sm text-(--text-color) block mb-1 font-bold">
                  Email
                </span>
                <span className="text-xl font-bold group-hover:text-(--main) text-(--text-color-emphasis) transition-colors border-b-2 border-transparent group-hover:border-(--main) pb-1">
                  {process.env.NEXT_PUBLIC_EMAIL}
                </span>
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_MOBILE}`}
                className="block group w-fit"
              >
                <span className="text-sm text-(--text-color) block mb-1 font-bold">
                  Inquiries
                </span>
                <span className="text-xl font-bold group-hover:text-(--main) text-(--text-color-emphasis) transition-colors border-b-2 border-transparent group-hover:border-(--main) pb-1">
                  {process.env.NEXT_PUBLIC_MOBILE}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 flex flex-col md:flex-row justify-between items-center gap-6 text-(--text-subtle) text-sm border-t border-(--border)">
          <div className="flex items-center gap-4">
            <Image
              src="/img/logo/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
            <span className="font-medium">© {currentYear}</span>
          </div>

          <div className="flex gap-10 font-bold uppercase tracking-widest text-[10px]">
            <Link
              href="/comming-soon"
              className="hover:text-(--main) transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/comming-soon"
              className="hover:text-(--main) transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/comming-soon"
              className="hover:text-(--main) transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Watermark */}
      <div className="absolute -bottom-16 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.04]">
        <h1 className="text-[18vw] text-(--text-color-emphasis) font-black whitespace-nowrap leading-none tracking-tighter">
          TRUE11PLUS EDUCATION
        </h1>
      </div>
    </footer>
  );
}
