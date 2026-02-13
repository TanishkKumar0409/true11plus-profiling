import { Link } from "react-router-dom";
import { BiHomeAlt, BiErrorCircle } from "react-icons/bi";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 h-full min-h-screen items-center justify-center p-6 bg-(--primary-bg)">
      <div className="text-center max-w-sm">
        {/* Simplified Icon Visual */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-(--danger-subtle) rounded-full flex items-center justify-center">
            <BiErrorCircle size={40} className="text-(--danger)" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-(--text-main) mb-2">
          Page Not Found
        </h1>
        <p className="text-(--text-muted) mb-8 leading-relaxed">
          The page you are looking for doesn't exist within the dashboard.
          Please use the sidebar to navigate to an active section.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-custom bg-(--main) text-(--white) hover:opacity-90 font-semibold transition-all shadow-custom"
          >
            <BiHomeAlt size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-10 pt-6 border-t border-(--border)">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to="/profile"
              className="text-xs font-bold uppercase tracking-wider text-(--text-muted) hover:text-(--main) transition-colors"
            >
              My Profile
            </Link>
            <Link
              to="/comming-soon"
              className="text-xs font-bold uppercase tracking-wider text-(--text-muted) hover:text-(--main) transition-colors"
            >
              Get Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
