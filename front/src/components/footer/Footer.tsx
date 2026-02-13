"use client";

import { true11SocialMedia } from "@/common/SocialMediaData";
import { motion } from "framer-motion";
import Link from "next/link";
import { BiMailSend, BiPhone } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/comming-soon" },
      { name: "Our Mentors", href: "/comming-soon" },
      { name: "Success Stories", href: "/comming-soon" },
      { name: "Careers", href: "/comming-soon" },
    ],
    services: [
      { name: "UK Admissions", href: "/comming-soon" },
      { name: "US University Roadmap", href: "/comming-soon" },
      { name: "Visa Assistance", href: "/comming-soon" },
      { name: "Scholarship Support", href: "/comming-soon" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/comming-soon" },
      { name: "Terms of Service", href: "/comming-soon" },
      { name: "Cookie Policy", href: "/comming-soon" },
    ],
  };

  return (
    <footer className="bg-(--primary-bg) border-t border-(--border) pt-20 pb-10 font-sans">
      <div className="px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-1 group">
                <img src="./img/logo/logo.png" alt="Logo" className="h-10" />
              </Link>
            </div>
            <p className="text-(--text-subtle) leading-relaxed">
              Empowering global students to reach their academic potential at
              the world's most prestigious universities.  
            </p>
            <div className="flex gap-4">
              {true11SocialMedia.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, color: item.color }}
                    className="w-10 h-10 rounded-full bg-(--secondary-bg) flex items-center justify-center text-(--text-color) border border-(--border) transition-colors"
                    aria-label={item.label}
                  >
                    <IconComponent size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-(--text-color) font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-(--text-subtle) hover:text-(--main) transition-colors duration-300 flex items-center group"
                  >
                    <BsArrowRight
                      size={12}
                      className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-(--text-color) font-bold mb-6">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-(--text-subtle) hover:text-(--main) transition-colors duration-300 flex items-center group"
                  >
                    <BsArrowRight
                      size={12}
                      className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="space-y-6">
            <h4 className="text-(--text-color) font-bold">Any Doubt</h4>
            <div className="space-y-3">
              {/* Added link for Email */}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                className="flex items-center gap-3 text-(--text-subtle) hover:text-(--main) transition-colors"
              >
                <BiMailSend size={16} className="text-(--main)" />
                <span className="text-sm">{process.env.NEXT_PUBLIC_EMAIL}</span>
              </a>
              {/* Added link for Mobile */}
              <a 
                href={`tel:${process.env.NEXT_PUBLIC_MOBILE}`}
                className="flex items-center gap-3 text-(--text-subtle) hover:text-(--main) transition-colors"
              >
                <BiPhone size={16} className="text-(--main)" />
                <span className="text-sm">{process.env.NEXT_PUBLIC_MOBILE}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-(--border) flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-(--text-color) text-sm">
            © {currentYear} True11Plus Education. All rights reserved.
          </p>
          <div className="flex gap-8">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-(--text-subtle) text-sm hover:text-(--main) transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}