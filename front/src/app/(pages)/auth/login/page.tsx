"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { getToken } from "@/contexts/getAssets";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      email: "",
      password: "",
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/auth/login", values);
        toast.success(response.data.message || "Logged in successfully!");
        router.push("/");
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
          Welcome Back!
        </h1>
        <p className="text-(--gray)">
          Please enter your details to access your account.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-(--text-color-emphasis) mb-2 ml-1">
          Email
        </label>
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

        <div className="flex justify-end mt-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-(--main) hover:text-(--main-emphasis) transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-(--main) rounded-xl py-4 text-2xl font-bold text-(--white) transition-colors hover:bg-(--main-emphasis) disabled:opacity-50 mt-4"
      >
        {formik.isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <div className="text-center pt-2">
        <p className="text-(--gray) font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-(--main) hover:text-(--main-emphasis) font-bold transition-colors"
          >
            Register Now
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
