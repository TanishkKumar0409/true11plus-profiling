import { Link } from "react-router-dom";
import { BiRocket, BiInfoCircle, BiHomeAlt } from "react-icons/bi";

export default function ComingSoon() {
  return (
    <div className="flex flex-col flex-1 h-full min-h-[70vh] items-center justify-center p-6 bg-(--primary-bg)">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-(--main-subtle) rounded-3xl flex items-center justify-center text-(--main)">
            <BiRocket size={40} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-(--text-main) mb-2">
          This Feature is Coming Soon
        </h1>
        <p className="text-(--text-muted) mb-8 leading-relaxed">
          Our team is currently refining this module to ensure the best
          experience. Stay tuned for the official rollout.
        </p>

        {/* Action Button */}
        <div className="flex justify-center mb-10">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-custom bg-(--main) text-(--white) hover:opacity-90 font-semibold transition-all shadow-custom"
          >
            <BiHomeAlt size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Info Card */}
        <div className="flex items-start gap-4 p-4 bg-(--secondary-bg) rounded-custom text-left border border-(--border)">
          <div className="mt-1 text-(--main)">
            <BiInfoCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-(--text-main) mb-1">
              Want early access?
            </h4>
            <p className="text-xs text-(--text-muted) leading-normal">
              Keep your profile updated. We often invite active community
              members to beta test new modules before they go public.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
