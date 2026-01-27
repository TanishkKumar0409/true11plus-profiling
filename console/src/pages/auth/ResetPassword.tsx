"use client";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { API } from "../../contexts/API";
import { emailValidation } from "../../contexts/ValidationSchema";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigator = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/forgot-password", values);
        toast.success(response.data.message);
        navigator(`/auth/reset-password/send/${values.email}`);
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
                className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
                placeholder="Enter your email"
              />
            </div>
            {getFormikError(formik, "email")}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-purple-500 rounded-xl py-4 text-2xl font-bold text-white transition-colors"
          >
            {formik.isSubmitting ? "Sending Mail..." : "Reset Your Password"}
          </button>

          {/* Remember password link */}
          <div className="text-center pt-2">
            <p className="text-gray-600 font-medium">
              Remember your password?{" "}
              <Link
                to="/"
                className="text-purple-500 hover:text-purple-700 font-bold transition-colors"
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
