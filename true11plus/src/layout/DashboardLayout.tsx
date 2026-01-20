import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { type UserRole } from '../common/routesData';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') as UserRole;
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    if (isMobile) setIsMobileOpen(!isMobileOpen);
    else setIsCollapsed(!isCollapsed);
  };

  if (!role) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar 
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        closeMobile={() => setIsMobileOpen(false)}
        role={role}
      />

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${isMobile ? 'ml-0 w-full' : (isCollapsed ? 'ml-20' : 'ml-64')}
        `}
      >
        <Navbar 
          toggleSidebar={handleToggleSidebar} 
          isCollapsed={isCollapsed}
          role={role}
          onLogout={handleLogout}
        />

        <main className="p-4 md:p-6 mt-16 w-full overflow-x-hidden bg-[#f8f8f8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;