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
