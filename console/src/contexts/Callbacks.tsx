import type { AxiosError } from "axios";
import type { FormikProps } from "formik";
import type { JSX } from "react";
import toast from "react-hot-toast";
import type {
  CategoryProps,
  FieldDataSimple,
  StatusProps,
} from "../types/Types";

export function getFormikError<T>(
  formik: FormikProps<T>,
  field: keyof T,
): JSX.Element | null {
  const touched = formik.touched[field];
  const error = formik.errors[field];

  if (!touched || typeof error !== "string") {
    return null;
  }

  return <p className="text-xs text-(--danger)! ml-1">{error}</p>;
}

export const getErrorResponse = (error: unknown, hide = false): void => {
  const err = error as AxiosError<{ error?: string; message?: string }>;

  if (!hide) {
    toast.error(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed To Process Your Request",
    );
  }

  console.error(
    err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      error,
  );
};

export const getUserAvatar = (images: string[]) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_URL;

  const avatarUrl = images?.[0]
    ? images[0].startsWith("http")
      ? images[0]
      : mediaUrl
        ? `${mediaUrl}${images[0]}`
        : `/img/defaults/avatar.png`
    : "/img/defaults/avatar.png";
  return avatarUrl;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function getFieldDataSimple<T>(
  data: T[],
  field: keyof T,
): FieldDataSimple[] {
  const uniqueValues = Array.from(
    new Set(data.map((item) => item[field]).filter(Boolean)),
  );

  return uniqueValues.map((val) => ({
    title: String(val),
    value: data.filter((item) => item[field] === val).length,
  }));
}
export function maskSensitive(input?: string | null): string {
  if (!input) return "N/A"; // handle undefined, null, or empty string

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return localPart[0] + "*".repeat(localPart.length - 1) + "@" + domain;
    }
    return (
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1] +
      "@" +
      domain
    );
  };

  const maskMobile = (str: string) => {
    const cleaned = str.startsWith("+") ? str.slice(1) : str;
    if (cleaned.length <= 4) {
      return "*".repeat(cleaned.length);
    }
    return "*".repeat(cleaned.length - 4) + cleaned.slice(-4);
  };

  const maskGeneric = (str: string) => {
    if (str.length <= 2)
      return str[0] + "*".repeat(Math.max(0, str.length - 1));
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(input)) {
    return maskEmail(input);
  }

  const mobilePattern = /^\+?\d{10,15}$/;
  if (mobilePattern.test(input)) {
    return maskMobile(input);
  }

  return maskGeneric(input);
}

export const getPercentageColor = (value: number) => {
  if (value <= 30) return "red";
  if (value <= 70) return "blue";
  if (value >= 100) return "green";
  return "purple";
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "approved":
      return "success";
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "danger";
    case "rejected":
      return "danger";
    case "submitted":
      return "blue";
    case "hold":
      return "warning";
    case "started":
      return "primary";
    case "assign":
      return "blue";
    default:
      return "primary";
  }
};

export const getStatusAccodingToField = (
  allStatus: StatusProps[],
  field: string,
) => {
  return allStatus.filter(
    (status) => status?.parent_status?.toLowerCase() === field.toLowerCase(),
  );
};

export const matchPermissions = (
  userPermissions: string[] = [],
  requiredPermissions: string,
) => {
  const hasPermission =
    userPermissions?.some(
      (item) =>
        item?.toLocaleLowerCase() === requiredPermissions?.toLocaleLowerCase(),
    ) || false;
  return hasPermission;
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getCategoryAccodingToField = (
  allCategories: CategoryProps[],
  field: string,
) => {
  return allCategories.filter(
    (category) =>
      category.parent_category?.toLowerCase() === field.toLowerCase(),
  );
};

export function stripHtml(html: string, limit: number = 160): string {
  const text = html?.replace(/<[^>]+>/g, "").trim() || "";

  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }

  return text;
}
