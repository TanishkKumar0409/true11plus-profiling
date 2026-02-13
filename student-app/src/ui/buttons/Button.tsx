import type { MouseEventHandler, ReactNode } from "react";
import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

interface ButtonBaseProps {
  label?: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  href?: string;
  disable?: boolean;
  target?: string;
  title?: string;
  Icon?: IconType;
}

export const ButtonGroup = ({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
  href,
  disable,
  target,
  title,
  Icon,
}: ButtonBaseProps) => {
  const baseClasses = `btn-shine ${className} flex items-center justify-center gap-2`;

  const content = (
    <>
      {Icon ? <Icon className="w-4 h-4" /> : null}
      <span>{label}</span>
    </>
  );

  if (href && href.trim() !== "") {
    return (
      <Link
        to={href}
        target={target || "_self"}
        className={`${baseClasses} block text-center`}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disable}
      title={title}
    >
      {content}
    </button>
  );
};

export const SecondButton = ({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
  href,
  disable,
  target,
  title,
  Icon,
}: ButtonBaseProps) => {
  const baseClasses = `btn-shine-secondary ${className} flex items-center justify-center gap-2`;

  const content = (
    <>
      {Icon ? <Icon className="w-4 h-4" /> : null}
      <span>{label}</span>
    </>
  );

  if (href && href.trim() !== "") {
    return (
      <Link
        to={href}
        target={target || "_self"}
        className={`${baseClasses} block text-center`}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disable}
      title={title}
    >
      {content}
    </button>
  );
};
