import type { AxiosError } from "axios";
import type { FormikProps } from "formik";
import type { JSX } from "react";
import toast from "react-hot-toast";

export function getFormikError<T>(
  formik: FormikProps<T>,
  field: keyof T
): JSX.Element | null {
  const touched = formik.touched[field];
  const error = formik.errors[field];

  if (!touched || typeof error !== "string") {
    return null;
  }

  return <p className="text-xs text-red-500 ml-1">{error}</p>;
}

export const getErrorResponse = (error: unknown, hide = false): void => {
  const err = error as AxiosError<{ error?: string; message?: string }>;

  if (!hide) {
    toast.error(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed To Process Your Request"
    );
  }

  console.error(
    err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      error
  );
};

export const getUserAvatar = (images: string[]) => {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

  const avatarUrl = images?.[0]
    ? images[0].startsWith("http")
      ? images[0]
      : mediaUrl
      ? `${mediaUrl}${images[0]}`
      : `/img/defaults/avatar.png`
    : "/img/defaults/avatar.png";

  return avatarUrl;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
