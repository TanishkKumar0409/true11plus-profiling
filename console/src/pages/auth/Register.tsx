import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import { registreValidation } from "../../contexts/ValidationSchema";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";
import { API } from "../../contexts/API";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiThumbsUp } from "react-icons/fi";

const RegisterPage = () => {
  const redirector = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      mobile_no: "",
      password: "",
      confirm_password: "",
      terms: false,
      role: "mentor",
    },
    validationSchema: registreValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/register", values);
        toast.success(response.data.message);
        redirector(`/auth/verify-email/${values.email}`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5 relative z-10">
      {/* Username Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            {...formik.getFieldProps("username")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Enter your username"
          />
        </div>
        {getFormikError(formik, "username")}
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Name
        </label>
        <div className="relative">
          <input
            type="text"
            {...formik.getFieldProps("name")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Enter your full name"
          />
        </div>
        {getFormikError(formik, "name")}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          E-mail
        </label>
        <div className="relative">
          <input
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Enter your email address"
          />
        </div>
        {getFormikError(formik, "email")}
      </div>

      {/* Contact Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Mobile Number
        </label>
        <div className={`relative rounded-2xl bg-gray-100`}>
          <PhoneInput
            country={"in"}
            value={formik.values.mobile_no}
            onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
            enableSearch={true}
            containerClass="!w-full !border-none"
            inputClass="!w-full !h-[56px] !bg-transparent !border-none !text-base !font-medium !pl-[60px] !text-gray-700"
            buttonClass="!bg-transparent !border-none !pl-2"
            placeholder="Enter your mobile number"
          />
        </div>
        {getFormikError(formik, "mobile_no")}
      </div>

      {/* Password Field */}
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
          {/* Toggle Eye */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "password")}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...formik.getFieldProps("confirm_password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-gray-100 text-gray-600 focus:bg-white focus:ring-2 focus:ring-purple-200`}
            placeholder="Confirm your password"
          />
          {/* Toggle Eye for Confirm Password */}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "confirm_password")}
      </div>

      {/* Terms and Privacy Policy */}
      <div className="flex items-center gap-3 pt-2">
        <div className="relative flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...formik.getFieldProps("terms")}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-400 transition-all checked:border-gray-900 checked:bg-gray-900"
          />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
            <FiThumbsUp size={12} strokeWidth={4} />
          </div>
        </div>
        <label
          htmlFor="terms"
          className="text-sm font-medium text-gray-500 cursor-pointer"
        >
          I agree to the{" "}
          <span className="text-gray-900 font-bold">Privacy & Policy</span>
        </label>
      </div>
      {getFormikError(formik, "terms")}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting || !formik.values.terms}
        className="w-full bg-purple-500 rounded-xl py-4 text-2xl font-bold text-white transition-colors"
      >
        {formik.isSubmitting ? "Registering..." : "Register"}
      </button>

      <div className="text-center pt-2">
        <p className="text-gray-600 font-medium">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-purple-500 hover:text-purple-800 font-bold transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
