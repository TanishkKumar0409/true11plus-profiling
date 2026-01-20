import Link from "next/link";
import React from "react";
import { LoaderIcon } from "react-hot-toast";
import { IconType } from "react-icons";
import { BiSend } from "react-icons/bi";

interface ButtonGroupProps {
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  href?: string;
  onClick?: any;
  disable: boolean;
}

export const ButtonGroup = ({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
  href,
  disable,
}: ButtonGroupProps) => {
  const baseClasses = `btn-custom ${className} `;
  if (href && href.trim() !== "") {
    return (
      <Link href={href} className={`${baseClasses} block text-center`}>
        {label}
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
      {label}
    </button>
  );
};

// button 2
interface ButtonGroupSecondaryProps {
  label?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export const ButtonGroupSecondary: React.FC<ButtonGroupSecondaryProps> = ({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
}) => (
  <button type={type} onClick={onClick} className={`btn-custom-2 ${className}`}>
    {label}
  </button>
);

interface ButtonGroup2Props {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: any;
  disable: boolean;
  isSubmitting?: boolean;
  className?: string;
  Icon?: IconType;
}

export default function ButtonGroupSend({
  label = "Save Changes",
  type = "button",
  onClick,
  className = "",
  disable,
  isSubmitting = false,
  Icon = BiSend,
}: ButtonGroup2Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disable}
      className={`btn-shine text-shadow py-2 px-4 rounded-custom flex items-center justify-center gap-2  ${className}`}
    >
      {isSubmitting ? (
        <>
          <LoaderIcon className="w-5 h-5 animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
