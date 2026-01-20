"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconType } from "react-icons";
import { FiClipboard, FiHome } from "react-icons/fi";
import { BiMenu, BiSolidDashboard, BiX } from "react-icons/bi";
import { UserProps } from "@/types/UserProps";
import { getErrorResponse, getUserAvatar } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import Image from "next/image";
import ProfileSidebar from "./ProfileSidebar";

interface NavItem {
  name: string;
  href: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Tasks", href: "/tasks", icon: FiClipboard },
  { name: "Dashboard", href: "/dashboard", icon: BiSolidDashboard },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/auth/user`);
      setProfile(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-(--primary-bg) border-b border-(--border) sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/img/logo/logo.png"
                alt="true11plus"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                      ${
                        active
                          ? "text-(--main) bg-(--main-light)"
                          : "text-(--text-color) hover:text-(--main) hover:bg-(--main-light)"
                      }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}

              {!loading && (
                <button
                  onClick={handleProfileClick}
                  className="ml-2 flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-transparent hover:border-(--border) hover:bg-(--gray-subtle) transition-all"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-(--border)">
                    <Image
                      src={getUserAvatar(profile?.avatar || [])}
                      fill
                      className="object-cover"
                      alt={profile?.name || ""}
                    />
                  </div>
                  <span className="text-sm font-medium text-(--text-color-emphasis)">
                    {profile?.username}
                  </span>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-(--text-color) p-2 hover:bg-(--gray-subtle) rounded-lg transition"
            >
              {isMobileMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-(--primary-bg) border-t border-(--border)">
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition
                      ${
                        active
                          ? "text-(--main) bg-(--main-light)"
                          : "text-(--text-color) hover:text-(--main) hover:bg-(--main-light)"
                      }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}

              {!loading && (
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition text-(--text-color) hover:text-(--main) hover:bg-(--main-light) border-t border-(--gray-subtle) mt-2 pt-4"
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={getUserAvatar(profile?.avatar || [])}
                      fill
                      alt={profile?.name || ""}
                    />
                  </div>
                  My Profile
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
      />
    </>
  );
};

export default Navbar;
