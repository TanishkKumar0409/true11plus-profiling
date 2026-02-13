"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/ui/button/Button";
import { BsArrowRight } from "react-icons/bs";
import { BiChevronDown, BiMenu, BiX } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { UserProps } from "@/types/UserProps";
import { getErrorResponse, getUserAvatar } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import { ProfileSidebar } from "./ProfileSidebar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const [profile, setProfile] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
    setIsOpen(false);
  };

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/auth/user`);
      setProfile(response.data);
    } catch (error) {
      setProfile(null);
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/comming-soon" },
    { name: "Mentors", href: "/comming-soon" },
    { name: "Scholarships", href: "/comming-soon" },
    { name: "Success Stories", href: "/comming-soon" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 md:px-12 ${
          scrolled
            ? "bg-(--primary-bg) backdrop-blur-lg py-3 shadow-sm"
            : "bg-(--primary-bg) py-3"
        }`}
      >
        <div className="px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <div className="">
              <img src="/img/logo/logo.png" alt="Logo" className="h-10" />
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-(--main) ${
                    isActive ? "text-(--main)" : "text-(--text-color)"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="h-0.5 w-full bg-(--main) mt-1"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-24 animate-pulse bg-(--secondary-bg) rounded-md" />
            ) : profile ? (
              <Button
                label={profile?.name}
                variant="secondary"
                onClick={handleProfileClick}
                icon={
                  <img
                    src={getUserAvatar(profile?.avatar || [])}
                    alt={profile?.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                }
                className="flex items-center gap-3"
              />
            ) : (
              <Button
                label="Login"
                href="/auth/login"
                icon={<BsArrowRight size={16} />}
                className="flex items-center gap-3"
              />
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-(--text-color) z-110"
          >
            {isOpen ? <BiX size={28} /> : <BiMenu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-90 bg-(--primary-bg) lg:hidden flex flex-col pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl font-bold transition-colors flex items-center justify-between ${
                      isActive ? "text-(--main)" : "text-(--text-color)"
                    } hover:text-(--main)`}
                  >
                    {link.name}
                    <BiChevronDown className="-rotate-90 text-(--text-subtle)" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto mb-12 flex flex-col gap-4">
              {profile ? (
                <Button
                  onClick={handleProfileClick}
                  label="My Profile"
                  variant="primary"
                  icon={
                    <img
                      src={getUserAvatar(profile?.avatar || [])}
                      className="h-6 w-6 rounded-full"
                      alt=""
                    />
                  }
                />
              ) : (
                <>
                  <Button
                    variant="secondary"
                    label="Sign In"
                    href="/auth/login"
                  />
                  <Button
                    label="Join Free"
                    href="/auth/register"
                    icon={<BsArrowRight size={16} />}
                    className="flex items-center gap-3 justify-center"
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        authUser={profile}
      />
    </>
  );
}