import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS, type UserRole } from '../common/routesData';
import { X, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  closeMobile: () => void;
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, isCollapsed, closeMobile, role }) => {
  const items = SIDEBAR_ITEMS[role] || [];
  const navigate = useNavigate();

  // --- DYNAMIC SETTINGS PATH LOGIC ---
  // This determines the URL based on the current user role
  const settingsPath = 
    role === 'admin' ? '/admin/settings' : 
    role === 'mentor' ? '/mentor/settings' : 
    '/user/settings'; // Default to user

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      closeMobile();
    }
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, local storage)
    console.log("Logging out...");
    navigate('/login');
  };

  // Helper to keep class names clean and consistent
  const getItemClass = (isActive: boolean) => `
    flex items-center rounded-lg transition-all duration-200 group font-medium border w-full
    ${isCollapsed ? 'p-2 justify-center' : 'p-2 gap-3'}
    ${isActive 
      ? 'bg-purple-50 text-purple-600 border-purple-100' 
      : 'text-gray-600 border-transparent hover:bg-purple-50 hover:text-purple-600'
    }
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden
        ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        onClick={closeMobile}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white z-50 transition-all border-r border-gray-100 duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-17' : 'lg:w-64'}
        w-64 /* Mobile is always 64 (Wide) */
        `}
      >
        {/* --- 1. Header (Logo) --- */}
        <div className={`h-16 flex flex-none items-center px-4 
          ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}
        >
          <Link to="/">
            <span className={`hidden ${isCollapsed ? 'lg:block' : ''}`}>
              <img src="/img/favicon.png" alt="Logo" className='h-9' />
            </span>
            
            <span className={`${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <img src="/img/logo.png" alt="Full Logo" className='h-10'/>
            </span>
          </Link>

          <button 
            onClick={closeMobile} 
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden ml-auto"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- 2. Main Navigation Links (Scrollable & Takes available space) --- */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end
              onClick={handleLinkClick}
              title={isCollapsed ? item.label : ''}
              className={({ isActive }) => getItemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <div className={`flex-shrink-0 transition-colors duration-200 
                    ${isActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'}`}
                  >
                    {item.icon}
                  </div>
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-200
                    ${isCollapsed ? 'hidden w-0' : 'block w-auto'}`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* --- 3. Bottom Section (Settings & Logout) --- */}
        <div className="flex-none p-3 border-t border-gray-100 space-y-2 bg-white">
          
          {/* Dynamic Settings Link */}
          <NavLink
            to={settingsPath} 
            onClick={handleLinkClick}
            title={isCollapsed ? "Settings" : ''}
            className={({ isActive }) => getItemClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <div className={`flex-shrink-0 transition-colors duration-200 
                  ${isActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'}`}
                >
                  <Settings size={20} />
                </div>
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-200
                  ${isCollapsed ? 'hidden w-0' : 'block w-auto'}`}
                >
                  Settings
                </span>
              </>
            )}
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ''}
            className={`w-full ${getItemClass(false)} hover:bg-red-50 hover:text-red-600 hover:border-red-100`}
          >
            <div className="flex-shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-200">
              <LogOut size={20} />
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-200
              ${isCollapsed ? 'hidden w-0' : 'block w-auto'}`}
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