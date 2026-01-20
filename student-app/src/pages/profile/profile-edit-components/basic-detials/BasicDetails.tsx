import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import { BiSave, BiEnvelope, BiUser, BiAt, BiGlobe } from "react-icons/bi";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { userEditValidation } from "../../../../contexts/ValidationSchema";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";

export default function BasicDetails() {
  const { authUser, getAuthUser } =
    useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: authUser?.name || "",
      username: authUser?.username || "",
      mobile_no: authUser?.mobile_no || "",
      website: authUser?.website || "",
    },
    validationSchema: userEditValidation,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await API.patch(`/user/${authUser?._id}`, values);
        getSuccessResponse(response);
        getAuthUser();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-500">
          Update your personal details and contact information.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiUser size={18} />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ex. John Doe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            {getFormikError(formik, "name")}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiAt size={18} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ex. johndoe123"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            {getFormikError(formik, "username")}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
              <span className="text-xs text-gray-400 font-normal ml-1">
                (Not editable)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiEnvelope size={18} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={authUser?.email}
                disabled
                className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg shadow-sm cursor-not-allowed select-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="relative">
              <PhoneInput
                country={"in"}
                value={formik.values.mobile_no}
                onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
                onBlur={() => formik.setFieldTouched("mobile_no", true)}
                inputProps={{
                  name: "mobile",
                  required: true,
                  autoFocus: false,
                }}
                containerClass="!w-full"
                inputClass={`!w-full !h-[38px] !text-sm !pl-12 !border !rounded-lg !bg-white focus:!ring-2 transition-all !border-gray-300 focus:!border-purple-500 focus:!ring-purple-500`}
                buttonClass={`!border-gray-300 !rounded-l-lg !bg-gray-50 hover:!bg-gray-100`}
                dropdownClass="!shadow-lg !rounded-lg !border-gray-200"
                enableSearch={true}
                disableSearchIcon={false}
              />
            </div>
            {getFormikError(formik, "mobile_no")}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiGlobe size={18} />
              </div>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="https://www.example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.website}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            {getFormikError(formik, "website")}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <BiSave size={18} />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
} 