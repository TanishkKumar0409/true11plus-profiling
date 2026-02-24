"use client";

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { userEditValidation } from "../../../../contexts/ValidationSchema";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { motion } from "framer-motion";
import { InputGroup, TextareaGroup } from "../../../../ui/form/FormComponents";
import { phoneInputClass } from "../../../../common/ExtraData";
import { ButtonGroup } from "../../../../ui/buttons/Button";

export default function BasicDetails() {
  const { authUser, getAuthUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: authUser?.name || "",
      username: authUser?.username || "",
      title: authUser?.title || "",
      about: authUser?.about || "",
      mobile_no: authUser?.mobile_no || "",
      website: authUser?.website || "",
      email_private: authUser?.email_private || false,
      mobile_private: authUser?.mobile_private || false,
    },
    validationSchema: userEditValidation,
    onSubmit: async (values) => {
      startLoadingBar();
      setIsLoading(true);
      try {
        const response = await API.patch(`/user/${authUser?._id}`, values);
        getSuccessResponse(response);
        getAuthUser();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
        stopLoadingBar();
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-(--primary-bg) rounded-custom shadow-custom p-6"
    >
      <div className="mb-6 border-b border-(--border) pb-4">
        <h3 className="text-lg font-bold text-(--text-color-emphasis) mb-1">
          Profile Settings
        </h3>
        <p className="text-sm font-medium text-(--text-subtle)">
          Update your personal details and control your contact visibility
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Full Name */}
          <div>
            <InputGroup
              label="Full Name"
              placeholder="Enter Your Full Name"
              type="text"
              id="name"
              {...formik.getFieldProps("name")}
            />
            {getFormikError(formik, "name")}
          </div>

          {/* Username */}
          <div>
            <InputGroup
              label="Username"
              placeholder="Enter Your User Name"
              type="text"
              id="username"
              {...formik.getFieldProps("username")}
            />
            {getFormikError(formik, "username")}
          </div>

          {/* Email + Privacy */}
          <div className="space-y-3">
            <InputGroup
              label="Email Address"
              note="Not Editable"
              placeholder="Enter Your Email Address"
              type="email"
              id="email"
              value={authUser?.email}
              disabled={true}
            />
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <input
                type="checkbox"
                name="email_private"
                checked={formik.values.email_private}
                onChange={formik.handleChange}
                className="w-4 h-4 rounded border-(--border) text-(--main) focus:ring-(--main)"
              />
              <span className="text-xs font-medium text-(--text-color) group-hover:text-(--main) transition-colors">
                Make email private (Hidden from profile)
              </span>
            </label>
          </div>

          {/* Phone + Privacy */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Phone</label>
              <div className="w-full">
                <PhoneInput
                  country="in"
                  value={formik.values.mobile_no}
                  onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
                  onBlur={() => formik.setFieldTouched("mobile_no", true)}
                  inputClass={`${phoneInputClass.input} w-full`}
                  buttonClass={phoneInputClass.button}
                  dropdownClass={phoneInputClass.dropdown}
                />
              </div>
              {getFormikError(formik, "mobile_no")}
            </div>
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <input
                type="checkbox"
                name="mobile_private"
                checked={formik.values.mobile_private}
                onChange={formik.handleChange}
                className="w-4 h-4 rounded border-(--border) text-(--main) focus:ring-(--main)"
              />
              <span className="text-xs font-medium text-(--text-color) group-hover:text-(--main) transition-colors">
                Make phone number private
              </span>
            </label>
          </div>

          {/* Headline */}
          <div>
            <InputGroup
              label="Profile Title / Headline"
              placeholder="Enter Your Profile Title / Headline"
              type="text"
              id="title"
              max={200}
              {...formik.getFieldProps("title")}
            />
            {getFormikError(formik, "title")}
          </div>

          {/* Website */}
          <div>
            <InputGroup
              label="Website"
              placeholder="Enter Your Website"
              type="url"
              id="website"
              {...formik.getFieldProps("website")}
            />
            {getFormikError(formik, "website")}
          </div>

          {/* About Bio */}
          <div className="space-y-1.5 md:col-span-2">
            <TextareaGroup
              id="about"
              placeholder="Share a brief bio about yourself..."
              {...formik.getFieldProps("about")}
              label="About Me"
              max={500}
            />
            {getFormikError(formik, "about")}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-(--border)">
          <ButtonGroup
            type="submit"
            disable={isLoading || !formik.isValid || !formik.dirty}
            label={isLoading ? "Saving..." : "Save Changes"}
          />
        </div>
      </form>
    </motion.div>
  );
}
