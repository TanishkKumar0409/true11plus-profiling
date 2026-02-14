import React from "react";
import Link from "next/link";

interface ButtonProps {
  label?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  href?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  hideText?: boolean;
}

export const Button = ({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
  href,
  disabled = false,
  icon,
  variant = "primary",
  hideText = false,
}: ButtonProps) => {
  const variantClasses =
    variant === "secondary" ? "btn-shine-secondary" : "btn-shine";
  const baseClasses =
    `${variantClasses} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`.trim();

  const content = (
    <div className="flex items-center gap-2 justify-center">
      {!hideText && label}
      {icon}
    </div>
  );

  if (href && href.trim() !== "") {
    return (
      <Link
        href={href}
        className={`${baseClasses} block text-center`}
        aria-disabled={disabled}
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
      disabled={disabled}
    >
      {content}
    </button>
  );
};
