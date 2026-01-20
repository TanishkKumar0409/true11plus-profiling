"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import { ResetPasswordValidation } from "@/contexts/ValidationSchema"; // Make sure to import this if you have it

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verify token on mount
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
    // validationSchema: ResetPasswordValidation,
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
    <form onSubmit={formik.handleSubmit} className="space-y-6 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--text-color-emphasis) mb-2">
          Reset Password
        </h1>
        <p className="text-(--gray)">
          Please enter your new password to secure your account.
        </p>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          New Password
        </label>
        <div className="relative">
          <input
            id="new_password"
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("new_password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--gray) hover:text-(--text-color)"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "new_password")}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            {...formik.getFieldProps("confirm_password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--gray) hover:text-(--text-color)"
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "confirm_password")}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-(--main) rounded-xl py-4 text-2xl font-bold text-(--white) transition-colors hover:bg-(--main-emphasis) disabled:opacity-50 mt-4"
      >
        {formik.isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
