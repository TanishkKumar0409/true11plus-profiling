import React from "react";
import { BiLogOut, BiX } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { SidbarNavigations } from "../../common/RouteData";
import { handleLogout } from "../../contexts/getAssets";

interface SidebarProps {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  closeMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  isCollapsed,
  closeMobile,
}) => {
  const items = SidbarNavigations || [];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white z-50 transition-all border-r border-gray-100 duration-300 shadow-xl lg:shadow-none flex flex-col
        /* Mobile: Controlled by isMobileOpen */
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        
        /* Desktop: Always visible (reset transform), width controlled by isCollapsed */
        lg:translate-x-0 
        ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Logo Section */}
        <div
          className={`h-16 flex flex-none items-center px-4 ${
            isCollapsed ? "lg:justify-center" : "justify-between"
          }`}
        >
          <Link to="/">
            {/* Desktop Logo logic */}
            <img
              src={isCollapsed ? "/img/logo/favicon.png" : "/img/logo/logo.png"}
              alt="Logo"
              className={`hidden lg:block ${isCollapsed ? "h-9" : "h-9"}`}
            />
            {/* Mobile Logo logic (always full logo) */}
            <img
              src="/img/logo/logo.png"
              alt="Logo"
              className="h-8 lg:hidden block"
            />
          </Link>

          <button
            onClick={closeMobile}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              onClick={() => window.innerWidth < 1024 && closeMobile()}
              title={item?.name}
              className={({ isActive }) =>
                `flex items-center rounded-lg transition-all duration-200 group font-medium border w-full ${
                  isCollapsed ? "lg:justify-center lg:px-2" : "px-3 gap-3"
                } p-2 ${
                  isActive
                    ? "bg-purple-50 text-purple-600 border-purple-100"
                    : "text-gray-600 border-transparent hover:bg-purple-50 hover:text-purple-600"
                }`
              }
            >
              <div className="flex-shrink-0 transition-colors group-hover:text-purple-600">
                <item.icon size={20} />
              </div>
              <span
                className={`whitespace-nowrap overflow-hidden transition-all ${
                  isCollapsed ? "lg:hidden lg:w-0" : "block"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Footer (Settings & Logout) */}
        <div className="flex-none p-3 border-t border-gray-100 space-y-2 bg-white">
          <Link
            to="/settings"
            className={`flex items-center rounded-lg transition-all duration-200 group font-medium border w-full text-gray-600 border-transparent hover:bg-purple-50 hover:text-purple-600 ${
              isCollapsed ? "lg:justify-center lg:px-2" : "px-3 gap-3"
            } p-2`}
            title="Settings"
          >
            <div className="flex-shrink-0 transition-colors group-hover:text-purple-600">
              <CiSettings size={20} />
            </div>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all ${
                isCollapsed ? "lg:hidden lg:w-0" : "block"
              }`}
            >
              Settings
            </span>
          </Link>

          <button
            className={`flex items-center rounded-lg transition-all duration-200 group font-medium border w-full text-gray-600 border-transparent hover:bg-red-50 hover:text-red-600 ${
              isCollapsed ? "lg:justify-center lg:px-2" : "px-3 gap-3"
            } p-2`}
            title="Logout"
            onClick={handleLogout}
          >
            <div className="flex-shrink-0 transition-colors">
              <BiLogOut size={20} />
            </div>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all ${
                isCollapsed ? "lg:hidden lg:w-0" : "block"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
