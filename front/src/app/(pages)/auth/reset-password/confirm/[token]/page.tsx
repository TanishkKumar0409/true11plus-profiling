"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FloatingPasswordInput } from "@/ui/inputs/FloatingInput";
import { LuArrowRight, LuLoader } from "react-icons/lu";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        const response = await API.get(`/auth/reset/${token}`);
        toast.success(response.data.message);
      } catch (error) {
        getErrorResponse(error);
        router.push("/auth/login");
      }
    };
    verifyToken();
  }, [token, router]);

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
      token: token,
    },
    // validationSchema: ResetPasswordValidatio,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/reset", values);
        toast.success(response.data.message);
        router.push("/auth/login");
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
        <h2 className="text-3xl font-bold text-gray-900"> Reset Password</h2>
        <p className="mt-2 text-gray-500">
          Please enter your new password to secure your account.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6 relative z-10">
        <div>
          <FloatingPasswordInput
            name="new_password"
            value={formik.values.new_password}
            label="New Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFormikError(formik, "new_password")}
        </div>
        <div>
          <FloatingPasswordInput
            name="confirm_password"
            value={formik.values.confirm_password}
            label="Confrim Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFormikError(formik, "confirm_password")}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-200"
        >
          {formik.isSubmitting ? (
            <>
              <LuLoader className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Reset Password
              <LuArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
