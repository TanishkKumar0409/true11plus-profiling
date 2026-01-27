"use client";
import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { loginValidation } from "../../contexts/ValidationSchema";
import { API } from "../../contexts/API";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";

const LoginPage = () => {
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/login", values);
        toast.success(response.data.message || "Logged in successfully!");
        navigator("/dashboard");
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 relative z-10">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Email
        </label>
        <div className="relative">
          <input
            type="text"
            {...formik.getFieldProps("email")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Enter your email"
          />
        </div>
        {getFormikError(formik, "email")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "password")}

        <div className="flex justify-end mt-2">
          <Link
            to="/auth/reset-password"
            className="text-sm font-medium text-purple-500 hover:text-purple-800 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-purple-500 rounded-xl py-4 text-2xl font-bold text-white transition-colors"
      >
        {formik.isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <div className="text-center pt-2">
        <p className="text-gray-600 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-purple-500 hover:text-purple-800 font-bold transition-colors"
          >
            Register Now
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
