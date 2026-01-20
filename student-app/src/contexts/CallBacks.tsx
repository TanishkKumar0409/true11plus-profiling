import type { AxiosError, AxiosResponse } from "axios";
import type { FormikProps } from "formik";
import type { JSX } from "react";
import toast from "react-hot-toast";

export const getSuccessResponse = (response: unknown, hide = false): void => {
  const res = response as AxiosResponse<{ message: string }>;
  if (!hide) {
    toast.success(res?.data?.message || "Successfully Done Your Request");
  }
  console.log(res?.data?.message || res);
};
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

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function getFormikError<T>(
  formik: FormikProps<T>,
  field: keyof T
): JSX.Element | null {
  const touched = formik.touched[field];
  const error = formik.errors[field];

  if (touched && typeof error === "string") {
    return (
      <div className="inline-flex">
        <p className="text-red-500 bg-red-100 rounded-xl px-2 py-1 text-xs mt-1">
          {error}
        </p>
      </div>
    );
  }

  return null;
}
