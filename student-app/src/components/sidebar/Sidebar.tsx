import { useState } from "react";
import { Link, useLocation } from "react-router";
import { SidbarNavigations } from "../../common/RouteData";
import { BiMenu, BiX } from "react-icons/bi";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center justify-start px-2 py-3 border-b border-(--border) shrink-0">
        {isCollapsed && !isMobileOpen ? (
          <img
            src="/img/logo/favicon.png"
            alt="Logo Collapsed"
            className="h-10 w-auto mx-auto"
          />
        ) : (
          <img
            src="/img/logo/logo.png"
            alt="Logo"
            className="h-10 w-auto px-2"
          />
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {SidbarNavigations.map((item, index) => {
          const isActive = pathname === item.href;
          const showFullMenu = !isCollapsed || isMobileOpen;

          return (
            <Link
              key={item.href || index}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center px-3 py-3 text-sm font-medium transition-all rounded-custom group
                ${
                  isActive
                    ? "bg-(--main-subtle) text-(--main)"
                    : "text-(--text-color) hover:text-(--main) hover:bg-(--main-subtle)"
                } 
                ${!showFullMenu ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${showFullMenu ? "mr-3" : ""}`}
              />
              {showFullMenu && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Menu"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-(--secondary-bg) rounded-custom shadow-custom"
      >
        {isMobileOpen ? (
          <BiX className="w-5 h-5 text-(--text-color-emphasis)" />
        ) : (
          <BiMenu className="w-5 h-5 text-(--text-color)" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 bg-(--primary-bg) border-r border-(--border) transition-all duration-300 ease-in-out z-40 flex-col
          ${isCollapsed ? "w-16" : "w-64"}`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-(--primary-bg) border-r border-(--border) transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
