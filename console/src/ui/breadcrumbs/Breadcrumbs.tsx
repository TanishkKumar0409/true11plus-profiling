import { BsArrowLeft } from "react-icons/bs";
import type { IconType } from "react-icons/lib";
import { Link, useNavigate } from "react-router-dom";
import { ButtonGroup, SecondButton } from "../button/Button";

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

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex flex-col items-start gap-1 min-w-0">
          <h1 className="text-2xl font-bold text-(--text-color-emphasis) tracking-tight truncate">
            {title}
          </h1>

          <nav className="flex items-center flex-wrap gap-1.5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-(--text-color) hover:text-(--main) hover:underline transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-(--text-color-emphasis) font-semibold">
                    {crumb.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <span className="text-(--text-color)">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {extraButtons?.map((btn, index) => {
            const Icon = btn.icon;

            if (btn.path) {
              return (
                <SecondButton
                  key={index}
                  Icon={Icon}
                  label={btn?.label}
                  href={btn?.path}
                  className="bg-(--primary-bg) border-0! shadow-custom"
                />
              );
            }

            return (
              <SecondButton
                key={index}
                Icon={Icon}
                label={btn?.label}
                onClick={btn.onClick}
                className="bg-(--primary-bg) border-0! shadow-custom"
              />
            );
          })}
          <ButtonGroup
            title={"Go Back"}
            onClick={() => navigate(-1)}
            Icon={BsArrowLeft}
            label="Back"
          />
        </div>
      </div>
    </div>
  );
}
