import React from "react";
import classNames from "classnames";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "outline";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-purple-50 text-purple-700 border border-purple-200",
  secondary: "bg-gray-50 text-gray-600 border border-gray-200",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  outline: "bg-transparent text-gray-500 border border-gray-300",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] font-semibold",
  md: "px-2.5 py-0.5 text-xs font-medium",
  lg: "px-3 py-1 text-sm font-medium",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-purple-500",
  secondary: "bg-gray-400",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  blue: "bg-blue-500",
  outline: "bg-gray-400",
};

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center capitalize rounded-full whitespace-nowrap transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={classNames(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  );
}
