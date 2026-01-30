"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { getToken } from "@/contexts/getAssets";
import {
  FloatingInput,
  FloatingPasswordInput,
} from "@/ui/inputs/FloatingInput";
import { LuArrowRight, LuLoader, LuMail } from "react-icons/lu";

const LoginPage = () => {
  const router = useRouter();

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
      setSubmitting(true);
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
    <div className="w-full max-w-lg">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="mt-2 text-gray-500">
          Please Enter your credentials to access your account.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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

        <div>
          <FloatingPasswordInput
            name="password"
            value={formik.values.password}
            label="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFormikError(formik, "password")}
        </div>

        <div className="flex items-center justify-end mb-8">
          <div className="text-sm">
            <Link
              href="/auth/reset-password"
              className="font-medium text-purple-600 hover:text-purple-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-200"
        >
          {formik.isSubmitting ? (
            <>
              <LuLoader className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              Login In
              <LuArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
