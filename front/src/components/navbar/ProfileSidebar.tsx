import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BiChevronRight,
  BiLogOut,
  BiUser,
  BiCog,
  BiLinkExternal,
} from "react-icons/bi";
import { API } from "../../contexts/API";
import toast from "react-hot-toast";
import type { UserProps } from "../../types/UserProps";
import { getErrorResponse, getUserAvatar } from "../../contexts/Callbacks";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";

interface Role {
  _id: string;
  role: string;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  external?: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface ProfileOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: UserProps | null;
}

export function ProfileSidebar({
  isOpen,
  onClose,
  authUser,
}: ProfileOffcanvasProps) {
  const FRONT_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
    if (!authUser?.role || roles.length === 0) return "";
    const foundRole = roles.find((r) => r._id === authUser.role);
    return foundRole?.role?.toLowerCase() || "";
  }, [authUser, roles]);

  const isStudent = roleName === "student";

  const SIDEBAR_SECTIONS: SidebarSection[] = isStudent
    ? [
        {
          label: "Account",
          items: [
            {
              label: "My Profile",
              href: `${process.env.NEXT_PUBLIC_STUDENT_APP_URL}/profile`,
              icon: BiUser,
              external: true,
            },
            {
              label: "Edit Profile",
              href: `${process.env.NEXT_PUBLIC_STUDENT_APP_URL}/profile/edit`,
              icon: BiCog,
              external: true,
            },
          ],
        },
        {
          label: "Public",
          items: [
            {
              label: "View Public Profile",
              href: `${FRONT_URL}/profile/${authUser?.username || ""}`,
              icon: BiLinkExternal,
              external: true,
            },
          ],
        },
      ]
    : [
        {
          label: "Account",
          items: [
            {
              label: "Console",
              href: `${process.env.NEXT_PUBLIC_CONSOLE_URL}`,
              icon: LuLayoutDashboard,
              external: true,
            },
          ],
        },
      ];

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      getErrorResponse(error, true);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-(--text-color-emphasis)/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-75 sm:w-95 bg-(--primary-bg) z-101 transform transition-transform duration-300 ease-out shadow-xl border-l border-(--border) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="px-6 py-5 flex items-center justify-between border-b border-(--border)">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={getUserAvatar(authUser?.avatar || [])}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover border border-(--border)"
                />
              </div>
              <div>
                <h4 className="font-semibold text-(--text-main)">
                  {authUser?.name || "Guest User"}
                </h4>
                <p className="text-sm text-(--text-muted)">{roleName}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {SIDEBAR_SECTIONS.map((section, idx) => (
              <div
                key={section.label}
                className={`px-4 py-3 ${idx !== SIDEBAR_SECTIONS.length - 1 ? "border-b border-(--border)" : ""}`}
              >
                <p className="px-2 mb-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <ProfileItem
                      key={item.label}
                      item={item}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto px-4 py-4 border-t border-(--border) bg-(--secondary-bg)/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-2 hover:bg-(--danger-subtle) transition-colors group rounded-custom"
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-(--danger-subtle) group-hover:bg-(--danger) text-(--danger) group-hover:text-(--white) transition-all">
                <BiLogOut size={18} />
              </span>
              <p className="font-semibold text-(--danger)">Logout</p>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ProfileItem({
  item,
  onClick,
}: {
  item: SidebarItem;
  onClick: () => void;
}) {
  const { href, icon: Icon, label, external } = item;

  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-bg) group-hover:bg-(--main) group-hover:text-(--white) group-hover:shadow-sm transition-all text-(--text-main)">
          <Icon size={18} />
        </div>
        <p className="font-medium group-hover:text-(--main) transition-colors">
          {label}
        </p>
      </div>
      <BiChevronRight
        size={18}
        className="text-(--text-muted) group-hover:text-(--main) transition-all"
      />
    </>
  );

  const className =
    "flex items-center justify-between p-2 hover:bg-(--main-subtle) text-(--text-color) transition-all group rounded-custom";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}
