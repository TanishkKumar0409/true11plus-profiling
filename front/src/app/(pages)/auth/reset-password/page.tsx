"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emailValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import toast from "react-hot-toast";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";

export default function ResetPassword() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/forgot-password", values);
        toast.success(response.data.message);
        router.push(`/auth/reset-password/send/${values.email}`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <div className="relative">
              <input
                type="text"
                {...formik.getFieldProps("email")}
                className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
                placeholder="Enter your email"
              />
            </div>
            {getFormikError(formik, "email")}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-(--main) rounded-xl py-4 text-2xl font-bold text-(--white) transition-colors hover:bg-(--main-emphasis) disabled:opacity-50 mt-4"
          >
            {formik.isSubmitting ? "Sending Mail..." : "Reset Your Password"}
          </button>

          {/* Remember password link */}
          <p className="text-(--gray) text-center font-medium">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-(--main) hover:text-(--main-emphasis) font-bold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
