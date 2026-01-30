"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emailValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import toast from "react-hot-toast";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FloatingInput } from "@/ui/inputs/FloatingInput";
import { LuArrowRight, LuLoader, LuMail } from "react-icons/lu";

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
    <div className="w-full max-w-lg">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-gray-500">
          Please Enter your Email to reset your password.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <FloatingInput
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Email Address"
              icon={LuMail}
            />
            {getFormikError(formik, "email")}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-200"
          >
            {formik.isSubmitting ? (
              <>
                <LuLoader className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-spin" />
                Sending Mail...
              </>
            ) : (
              <>
                Reset Your Password
                <LuArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
