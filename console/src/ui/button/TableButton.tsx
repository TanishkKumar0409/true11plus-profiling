import React from "react";
import { Link } from "react-router-dom";

interface TableButtonProps {
  buttontype?: "button" | "link";
  href?: string;
  onClick?: () => void;
  Icon: React.ElementType;
  tooltip?: string;
  color?: string;
  disabled?: boolean;
}

const colorStyles: Record<string, string> = {
  purple: "hover:bg-purple-50 hover:text-purple-700",
  blue: "hover:bg-blue-50 hover:text-blue-700",
  red: "hover:bg-red-50 hover:text-red-700",
  green: "hover:bg-green-50 hover:text-green-700",
  yellow: "hover:bg-yellow-50 hover:text-yellow-700",
  gray: "hover:bg-gray-100 hover:text-gray-700",
};

export default function TableButton({
  buttontype = "button",
  href,
  onClick,
  Icon,
  tooltip,
  color = "purple",
  disabled = false,
}: TableButtonProps) {
  const selectedColor = colorStyles[color] || colorStyles.purple;

  const className = `p-1.5 text-gray-500 rounded-md transition-colors ${selectedColor} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`;

  if (buttontype === "link" && href) {
    return (
      <Link to={href} className={className} title={tooltip}>
        <Icon size={18} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      title={tooltip}
      disabled={disabled}
    >
      <Icon size={18} />
    </button>
  );
}
