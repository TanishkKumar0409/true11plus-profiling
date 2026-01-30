import { BsArrowLeft } from "react-icons/bs";
import type { IconType } from "react-icons/lib";
import { Link, useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface ExtraButton {
  label: string;
  path?: string;
  onClick?: () => void;
  icon?: IconType;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
}

interface BreadcrumbsProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  extraButtons?: ExtraButton[];
}

export function Breadcrumbs({
  title,
  breadcrumbs,
  extraButtons,
}: BreadcrumbsProps) {
  const navigate = useNavigate();

  const btnBase =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all whitespace-nowrap active:scale-95";

  // Defined button variants with Tailwind colors
  const btnVariants = {
    primary: "text-white bg-purple-600 hover:bg-purple-700 shadow-purple-200",
    secondary: "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50",
    tertiary: "text-purple-700 bg-purple-50 hover:bg-purple-100",
    danger: "text-white bg-red-600 hover:bg-red-700 shadow-red-200",
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* LEFT SIDE: Title + Breadcrumbs */}
        <div className="flex flex-col items-start gap-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight truncate">
            {title}
          </h1>

          <nav className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-gray-500 hover:text-purple-600 hover:underline transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-300">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* RIGHT SIDE: Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {extraButtons?.map((btn, index) => {
            const Icon = btn.icon;
            const variantClass = btnVariants[btn.variant || "primary"];

            // Render as Link
            if (btn.path) {
              return (
                <Link
                  key={index}
                  to={btn.path}
                  className={`${btnBase} ${variantClass}`}
                  title={btn.label}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  <span>{btn.label}</span>
                </Link>
              );
            }

            // Render as Button
            return (
              <button
                key={index}
                onClick={btn.onClick}
                className={`${btnBase} ${variantClass}`}
                title={btn.label}
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                <span>{btn.label}</span>
              </button>
            );
          })}

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`${btnBase} ${btnVariants.secondary}`}
            title="Go Back"
          >
            <BsArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
