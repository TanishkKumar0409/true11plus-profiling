"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProps } from "@/types/UserProps";
import { API } from "@/contexts/API";
import { BiX, BiLogOut, BiUser, BiChevronRight } from "react-icons/bi";
import toast from "react-hot-toast";
import { getUserAvatar } from "@/contexts/Callbacks";
import { IconType } from "react-icons";

interface SidebarItem {
  label: string;
  href: string;
  icon: IconType;
  external: boolean
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Account",
    items: [
      {
        label: "My Profile",
        href: `${process.env.NEXT_PUBLIC_STUDENT_APP_URL}`,
        icon: BiUser,
        external: true
      },
    ],
  },
];

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProps | null;
}

export default function ProfileSidebar({
  isOpen,
  onClose,
  profile,
}: ProfileSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/auth/login");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-(--primary-bg) shadow-2xl z-[70] transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-l border-(--border) ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* 1. COMPACT HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-(--border) bg-(--secondary-bg)">
          <a
            href={`${process.env.NEXT_PUBLIC_STUDENT_APP_URL}`}
            target="_blank"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="relative w-10 h-10 min-w-[40px] rounded-full border border-(--border) overflow-hidden bg-(--white)">
              <Image
                src={getUserAvatar(profile?.avatar || [])}
                fill
                className="object-cover"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-(--text-color-emphasis) truncate max-w-[160px] group-hover:text-(--main) transition-colors">
                {profile?.name || "User"}
              </h3>
              <p className="text-xs text-(--gray) truncate max-w-[160px]">
                @{profile?.username || "username"}
              </p>
            </div>
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-(--gray) hover:bg-(--gray-subtle) hover:text-(--danger) transition-colors"
          >
            <BiX size={22} />
          </button>
        </div>

        {/* 2. BODY LINKS (Mapped) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_SECTIONS.map((section, index) => (
            <div key={section.label} className={index > 0 ? "mt-4" : ""}>
              <SectionLabel label={section.label} />
              {section.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  onClick={onClose}
                  external={item?.external}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 3. COMPACT FOOTER */}
        <div className="p-4 border-t border-(--border)">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-(--danger-subtle) text-(--danger) hover:bg-(--danger) hover:text-white transition-all text-sm font-medium duration-200"
          >
            <BiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

// --- Helper Components ---

const SectionLabel = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <p
    className={`px-3 py-1 text-[11px] font-bold text-(--gray) uppercase tracking-wider ${className}`}
  >
    {label}
  </p>
);

const SidebarLink = ({ href, icon: Icon, label, onClick, external }: any) => (
  <Link
    href={href}
    onClick={onClick}
    target={external ? "_blank" : "_self"}
    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-(--text-color) hover:bg-(--main-light) hover:text-(--main-emphasis) group transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <Icon
        size={18}
        className="text-(--gray) group-hover:text-(--main) transition-colors"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <BiChevronRight
      size={16}
      className="text-(--border) group-hover:text-(--main) opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
    />
  </Link>
);
