import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, LayoutDashboard, User, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ---------------- TYPES ---------------- */

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

/* ---------------- DATA ---------------- */

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/user/home", icon: Home },
  // { name: "Assessment", href: "/user/assessment", icon: ClipboardList },
  { name: "Tasks", href: "/user/tasks", icon: ClipboardList },
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/user/profile/12345", icon: User },
];

/* ---------------- COMPONENT ---------------- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            {/* Replace src with your actual logo path */}
            <img
              src="/img/logo.png"
              alt="true11plus"
              className="h-10 w-auto object-contain"
            />

          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive(item.href)
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition
                    ${isActive(item.href)
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;