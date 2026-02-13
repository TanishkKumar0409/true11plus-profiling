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
  primary: "bg-(--main-subtle) text-(--main) border border-(--main)",
  secondary: "bg-(--main-subtle) text-(--main) border border-(--main)",
  success: "bg-(--success-subtle) text-(--success) border border-(--success)",
  warning: "bg-(--warning-subtle) text-(--warning) border border-(--warning)",
  danger: "bg-(--danger-subtle) text-(--danger) border border-(--danger)",
  blue: "bg-(--blue-subtle) text-(--blue) border border-(--blue)",
  outline: "bg-(--gray-subtle) text-(--gray) border border-(--gray)",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] font-semibold",
  md: "px-2.5 py-0.5 text-xs font-medium",
  lg: "px-3 py-1 text-sm font-medium",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-(--main)",
  secondary: "bg-(--main)",
  success: "bg-(--success)",
  warning: "bg-(--warning)",
  danger: "bg-(--danger)",
  blue: "bg-(--blue)",
  outline: "bg-(--gray)",
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
