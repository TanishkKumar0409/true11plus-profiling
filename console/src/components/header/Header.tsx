import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { LuPanelLeft } from "react-icons/lu";
import { Link } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import type { UserProps } from "../../types/UserProps";
import { getUserAvatar } from "../../contexts/Callbacks";

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
  authUser: UserProps | null;
}

const Header: React.FC<NavbarProps> = ({
  toggleSidebar,
  isCollapsed,
  authUser,
}) => {
  const [sidebarProfile, setSidebarProfile] = useState(false);
  return (
    <>
      <nav
        className={`fixed top-0 right-0 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 z-30 transition-all duration-300 left-0 
  ${isCollapsed ? "lg:left-20" : "lg:left-64"}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
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

        <div className="flex-1 px-8 hidden md:block">
          <div className="relative group max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BiSearch className="h-4 w-4 text-purple-600" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-2 rounded-xl border border-gray-300 leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="relative p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-100 shadow-xs">
            <BiBell size={20} />
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
          </button> */}

          {/* <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div> */}

          <div
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl transition-colors cursor-pointer group"
            onClick={() => setSidebarProfile(!sidebarProfile)}
          >
            <div className="hidden sm:flex flex-col items-end justify-center">
              <span className="text-base font-bold text-gray-900 leading-tight">
                {authUser?.username}
              </span>
            </div>

            <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-purple-100 transition-colors">
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
        profile={authUser}
      />
    </>
  );
};

export default Header;
