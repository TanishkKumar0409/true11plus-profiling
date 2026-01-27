import { Link } from "react-router-dom";
import { BiShieldX, BiHomeAlt } from "react-icons/bi";

export default function AccessDenied() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-white">
      {/* Icon Container */}
      <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm ring-8 ring-red-50/50">
        <BiShieldX className="w-12 h-12 text-red-500" />
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
        Access Denied
      </h1>

      {/* Description */}
      <p className="text-gray-500 max-w-md mb-8 text-lg leading-relaxed">
        Sorry, you don't have permission to access this page. If you believe
        this is a mistake, please contact your system administrator.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
        >
          <BiHomeAlt className="text-lg" />
          Back to Dashboard
        </Link>
      </div>

      {/* Optional: Error Code */}
      <p className="mt-12 text-xs font-mono text-gray-400 uppercase tracking-widest">
        Error Code: 403 Forbidden
      </p>
    </div>
  );
}
