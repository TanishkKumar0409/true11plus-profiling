"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registreValidation } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { FiThumbsUp } from "react-icons/fi";
import { getToken } from "@/contexts/getAssets";
import {
  FloatingInput,
  FloatingPasswordInput,
  FloatingPhoneInput,
} from "@/ui/inputs/FloatingInput";
import { LuArrowRight, LuLoader, LuUser } from "react-icons/lu";

const RegisterPage = () => {
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
    <div className="w-full max-w-lg">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-500">
          Sign up to start documenting your journey.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
          <div>
            <FloatingInput
              type="text"
              name={`username`}
              value={formik.values.username}
              label="Username"
              icon={LuUser}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFormikError(formik, "username")}
          </div>
          <div>
            <FloatingInput
              type="text"
              name={`name`}
              value={formik.values.name}
              label="Name"
              icon={LuUser}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFormikError(formik, "name")}
          </div>
          <div>
            <FloatingInput
              type="text"
              name={`email`}
              value={formik.values.email}
              label="email"
              icon={LuUser}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFormikError(formik, "email")}
          </div>
          <div>
            <FloatingPhoneInput
              name="mobile_no"
              value={formik.values.mobile_no}
              onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
              label="mobile Number"
            />
            {getFormikError(formik, "mobile_no")}
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
          <div>
            <FloatingPasswordInput
              name="confirm_password"
              value={formik.values.confirm_password}
              label="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFormikError(formik, "confirm_password")}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="relative flex items-center">
            <input
              id="terms"
              type="checkbox"
              {...formik.getFieldProps("terms")}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-purple-400 checked:bg-purple-600"
            />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-(--white) opacity-0 peer-checked:opacity-100">
              <FiThumbsUp size={12} strokeWidth={4} />
            </div>
          </div>
          <label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <span className="font-medium text-purple-600 hover:text-purple-500 hover:underline">
              Privacy & Policy
            </span>
          </label>
        </div>
        {getFormikError(formik, "terms")}

        <button
          type="submit"
          disabled={!formik.values.terms || formik.isSubmitting}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-200"
        >
          {formik.isSubmitting ? (
            <>
              <LuLoader className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              Register
              <LuArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-center text-sm text-gray-500">
            If you are already a member, please{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>{" "}
    </div>
  );
};

export default RegisterPage;
