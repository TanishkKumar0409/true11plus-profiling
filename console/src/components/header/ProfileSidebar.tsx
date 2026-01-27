import { BiX, BiLogOut, BiUser, BiChevronRight } from "react-icons/bi";
import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import type { UserProps } from "../../types/UserProps";
import { handleLogout } from "../../contexts/getAssets";
import { getUserAvatar } from "../../contexts/Callbacks";

interface SidebarItem {
  label: string;
  href: string;
  icon: IconType;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Account",
    items: [
      {
        label: "My Profile",
        href: "/",
        icon: BiUser,
      },
    ],
  },
];

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
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-60 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-70 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-l border-gray-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 1. COMPACT HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <Link
            to={`/`}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="relative w-10 h-10 min-w-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
              <img
                src={getUserAvatar(profile?.avatar || [])}
                className="object-cover w-full h-full"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 truncate max-w-40 group-hover:text-purple-600 transition-colors">
                {profile?.name || "User"}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-40">
                @{profile?.username || "username"}
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
          >
            <BiX size={22} />
          </button>
        </div>

        {/* 2. BODY LINKS (Mapped) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_SECTIONS.map((section, index) => (
            <div key={section.label} className={index > 0 ? "mt-4" : ""}>
              <SectionLabel label={section.label} />
              {section.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  onClick={onClose}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 3. COMPACT FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all text-sm font-medium duration-200 shadow-sm hover:shadow-md"
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
    className={`px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${className}`}
  >
    {label}
  </p>
);

const SidebarLink = ({ href, icon: Icon, label, onClick }: any) => (
  <Link
    to={href}
    onClick={onClick}
    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-700 group transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <Icon
        size={18}
        className="text-gray-400 group-hover:text-purple-600 transition-colors"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <BiChevronRight
      size={16}
      className="text-gray-300 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
    />
  </Link>
);
