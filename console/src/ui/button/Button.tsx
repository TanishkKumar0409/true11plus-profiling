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
  noText?: boolean;
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
  const ButtonContent = () => (
    <>
      {Icon && <Icon className="w-4 h-4" />}
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
        <ButtonContent />
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
      <ButtonContent />
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
  Icon,
  noText = false,
}: ButtonBaseProps) => {
  const baseClasses = `btn-shine-secondary ${className} flex items-center justify-center gap-2`;

  const ButtonContent = () => (
    <>
      {Icon && <Icon className="w-4 h-4" />}
      {!noText && <span>{label}</span>}
    </>
  );

  if (href && href.trim() !== "") {
    return (
      <Link to={href} className={`${baseClasses} block text-center`}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disable}
    >
      <ButtonContent />
    </button>
  );
};
