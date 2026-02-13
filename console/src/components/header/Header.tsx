import React, { useState } from "react";
import { LuPanelLeft } from "react-icons/lu";
import { Link } from "react-router-dom";
import type { UserProps } from "../../types/UserProps";
import { getUserAvatar } from "../../contexts/Callbacks";
import { ProfileSidebar } from "./ProfileSidebar";

interface NavbarProps {
  onToggleCollapse: () => void;
  isCollapsed: boolean;
  authUser: UserProps | null;
}

const Header: React.FC<NavbarProps> = ({
  onToggleCollapse,
  isCollapsed,
  authUser,
}) => {
  const [sidebarProfile, setSidebarProfile] = useState(false);
  return (
    <>
      <nav
        className={`fixed top-0 right-0 bg-(--primary-bg) border-b border-(--border) py-2 flex items-center justify-between px-4 z-30 transition-all duration-300 left-0 
  ${isCollapsed ? "lg:left-16" : "lg:left-64"}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-(--text-color) bg-(--secondary-bg) hover:bg-(--main-subtle) hover:text-(--main) cursor-pointer transition-colors rounded-custom shadow-custom"
          >
            <LuPanelLeft size={20} />
          </button>
          <Link to="/" className="lg:hidden flex items-center ml-2">
            <img
              src="/img/logo/logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl transition-colors cursor-pointer group"
            onClick={() => setSidebarProfile(!sidebarProfile)}
          >
            <div className="hidden sm:flex flex-col items-end justify-center">
              <span className="font-medium text-(--text-color) leading-tight">
                {authUser?.username}
              </span>
            </div>

            <div className="h-10 w-10 rounded-full bg-(--secondary-bg) border-2 border-(--border) overflow-hidden group-hover:border-(--main) transition-colors shadow-custom">
              <img
                src={getUserAvatar(authUser?.avatar || [])}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>
      <ProfileSidebar
        isOpen={sidebarProfile}
        onClose={() => setSidebarProfile(false)}
        authUser={authUser}
      />
    </>
  );
};

export default Header;
