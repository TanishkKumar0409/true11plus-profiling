"use client";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../contexts/API";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";
// import { ResetPasswordValidation } from "@/contexts/ValidationSchema"; 

export default function ResetPasswordConfirm() {
  const { token } = useParams();
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Ref to prevent double execution in Strict Mode
  const effectRan = useRef(false);

  // Verify token on mount
  useEffect(() => {
    if (effectRan.current) return;

    const verifyToken = async () => {
      effectRan.current = true;
      if (!token) return;
      
      try {
        const response = await API.get(`/auth/reset/${token}`);
        toast.success(response.data.message);
      } catch (error) {
        getErrorResponse(error);
        navigator("/");
      }
    };
    
    verifyToken();
  }, [token, navigator]);

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
        navigator("/");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500">
          Please enter your new password to secure your account.
        </p>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 ml-1">
          New Password
        </label>
        <div className="relative">
          <input
            id="new_password"
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("new_password")}
            className="w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "new_password")}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 ml-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            {...formik.getFieldProps("confirm_password")}
            className="w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-600"
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        className="w-full bg-purple-600 rounded-xl py-4 text-xl font-bold text-white transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm"
      >
        {formik.isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}