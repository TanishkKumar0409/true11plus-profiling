"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registreValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FiEye, FiEyeOff, FiThumbsUp } from "react-icons/fi";
import { getToken } from "@/contexts/getAssets";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        router.push("/");
      }
    };

    checkToken();
  }, [router]);

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      mobile_no: "",
      password: "",
      confirm_password: "",
      terms: false,
    },
    validationSchema: registreValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/register", values);
        toast.success(response.data.message);
        router.push(`/auth/verify-email/${values.email}`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5 relative z-10">
      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            {...formik.getFieldProps("username")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Enter your username"
          />
        </div>
        {getFormikError(formik, "username")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Name
        </label>
        <div className="relative">
          <input
            type="text"
            {...formik.getFieldProps("name")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Enter your full name"
          />
        </div>
        {getFormikError(formik, "name")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          E-mail
        </label>
        <div className="relative">
          <input
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Enter your email address"
          />
        </div>
        {getFormikError(formik, "email")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Mobile Number
        </label>
        <div className={`relative rounded-2xl bg-(--gray-subtle)`}>
          <PhoneInput
            country={"in"}
            value={formik.values.mobile_no}
            onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
            enableSearch={true}
            containerClass="!w-full !border-none"
            inputClass="!w-full !h-[56px] !bg-transparent !border-none !text-base !font-medium !pl-[60px] !text-(--text-color)"
            buttonClass="!bg-transparent !border-none !pl-2"
            placeholder="Enter your mobile number"
          />
        </div>
        {getFormikError(formik, "mobile_no")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--gray) hover:text-(--text-color)"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {getFormikError(formik, "password")}
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...formik.getFieldProps("confirm_password")}
            className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none outline-none font-medium transition-all bg-(--gray-subtle) text-(--text-color) focus:bg-(--white) focus:ring-2 focus:ring-(--main)`}
            placeholder="Confirm your password"
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

      <div className="flex items-center gap-3 pt-2">
        <div className="relative flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...formik.getFieldProps("terms")}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-(--border) transition-all checked:border-(--gray-emphasis) checked:bg-(--gray-emphasis)"
          />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-(--white) opacity-0 peer-checked:opacity-100">
            <FiThumbsUp size={12} strokeWidth={4} />
          </div>
        </div>
        <label
          htmlFor="terms"
          className="text-sm font-medium text-(--gray) cursor-pointer"
        >
          I agree to the{" "}
          <span className="text-(--text-color-emphasis) font-bold">
            Privacy & Policy
          </span>
        </label>
      </div>
      {getFormikError(formik, "terms")}

      <button
        type="submit"
        disabled={formik.isSubmitting || !formik.values.terms}
        className="w-full bg-(--main) rounded-xl py-4 text-2xl font-bold text-(--white) transition-colors hover:bg-(--main-emphasis) disabled:opacity-50"
      >
        {formik.isSubmitting ? "Registering..." : "Register"}
      </button>

      <div className="text-center pt-2">
        <p className="text-(--gray) font-medium">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-(--main) hover:text-(--main-emphasis) font-bold transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
