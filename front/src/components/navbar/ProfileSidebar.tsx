"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProps } from "@/types/UserProps";
import { API } from "@/contexts/API";
import {
  BiX,
  BiLogOut,
  BiUser,
  BiChevronRight,
  BiCog,
  BiGridAlt,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { getUserAvatar, getErrorResponse } from "@/contexts/Callbacks";
import { IconType } from "react-icons";

interface Role {
  _id: string;
  role: string;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: IconType;
  external: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

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
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = useCallback(async () => {
    try {
      const response = await API.get(`/roles`);
      setRoles(response.data);
    } catch (error) {
      getErrorResponse(error);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const roleName = useMemo(() => {
    if (!profile?.role || roles.length === 0) return "";
    const foundRole = roles.find((r) => r._id === profile.role);
    return foundRole?.role?.toLowerCase() || "";
  }, [profile, roles]);

  const sidebarSections: SidebarSection[] = useMemo(() => {
    const sections: SidebarSection[] = [];

    if (roleName && roleName !== "student") {
      sections.push({
        label: "Administration",
        items: [
          {
            label: "Console",
            href: process.env.NEXT_PUBLIC_CONSOLE_URL || "#",
            icon: BiGridAlt,
            external: true,
          },
        ],
      });
    }

    const accountItems: SidebarItem[] = [
      {
        label: "My Profile",
        href: profile?.username ? `/profile/${profile.username}` : "#",
        icon: BiUser,
        external: false,
      },
    ];

    if (roleName === "student") {
      accountItems.push({
        label: "Settings",
        href: process.env.NEXT_PUBLIC_STUDENT_APP_URL || "#",
        icon: BiCog,
        external: true,
      });
    }

    sections.push({
      label: "Account",
      items: accountItems,
    });

    return sections;
  }, [roleName, profile]);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-60 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-l border-slate-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <Link
            href={profile?.username ? `/profile/${profile.username}` : "#"}
            onClick={onClose}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="relative w-10 h-10 min-w-10 rounded-full border border-slate-200 overflow-hidden bg-white shadow-sm">
              <Image
                src={getUserAvatar(profile?.avatar || [])}
                fill
                className="object-cover"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-40 group-hover:text-indigo-600 transition-colors">
                {profile?.name || "User"}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-40">
                @{profile?.username || "username"}
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* BODY LINKS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <SectionLabel label={section.label} />
              <div className="space-y-1 mt-2">
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.label}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={onClose}
                    external={item.external}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all text-sm font-semibold duration-200 shadow-sm"
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
    className={`px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ${className}`}
  >
    {label}
  </p>
);

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  onClick,
  external,
}: {
  href: string;
  icon: IconType;
  label: string;
  onClick: () => void;
  external: boolean;
}) => (
  <Link
    href={href}
    onClick={onClick}
    target={external ? "_blank" : "_self"}
    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 group transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <Icon
        size={20}
        className="text-slate-400 group-hover:text-indigo-600 transition-colors"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <BiChevronRight
      size={18}
      className="text-slate-300 group-hover:text-indigo-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
    />
  </Link>
);
