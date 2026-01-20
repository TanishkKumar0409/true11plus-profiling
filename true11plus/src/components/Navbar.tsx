import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import {Bell, Search, PanelLeft } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
  role: string | null;
  userName?: string;
  userImage?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  isCollapsed,
  role = "Student",
  userName = "User",
  userImage,
  // onLogout
}) => {

  // 2. Helper function to determine Profile URL based on Role
  const getProfilePath = (userRole: string | null) => {
    const r = userRole?.toLowerCase() || "";

    if (r === "admin") return "/admin/profile";
    if (r === "mentor") return "/mentor/profile";
    if (r === "student") return "/user/profile";

    return "/user/profile"; // Fallback default
  };

  const profileLink = getProfilePath(role);

  return (
    <nav
      className={`fixed top-0 right-0 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-2 z-30 transition-all duration-300
      left-0 
      ${isCollapsed ? 'lg:left-16' : 'lg:left-64'} 
      `}
    >
      {/* 1. LEFT SECTION: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* 2. CENTER SECTION: Search Bar */}
      <div className="flex-1 px-8 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-purple-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2 rounded-xl border border-gray-300 leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* 3. RIGHT SECTION: Notifications & Profile */}
      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        <button className="relative p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-100 shadow-xs">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

        {/* 4. Profile Section Link */}
        {/* Wrapped in Link to make it clickable */}
        <Link
          to={profileLink}
          className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl  transition-colors cursor-pointer group"
          title="Go to Profile"
        >
          {/* Text Info */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm text-gray-500 font-medium leading-tight group-hover:text-purple-600 transition-colors">
              {role || "Student"}
            </span>
            <span className="text-base font-bold text-gray-900 leading-tight">
              {userName}
            </span>
          </div>

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-purple-100 transition-colors">
            {userImage ? (
              <img
                src={userImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                {userName.charAt(0)}
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;