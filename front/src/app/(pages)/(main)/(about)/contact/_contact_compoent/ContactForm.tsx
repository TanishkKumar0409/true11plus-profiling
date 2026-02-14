"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import { Button } from "@/ui/button/Button";
import { getErrorResponse, getFormikError } from "@/contexts/Callbacks";
import { ContactSchema } from "@/contexts/ValidationSchema";
import { API } from "@/contexts/API";
import toast from "react-hot-toast";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ContactForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile_no: "",
      subject: "",
      message: "",
    },
    validationSchema: ContactSchema,
    onSubmit: async (values) => {
      try {
        const response = await API.post(`/contact-us/add`, values);
        toast.success(response.data.message);
        formik.resetForm();
      } catch (error) {
        getErrorResponse(error);
      }
    },
  });

  return (
    <section className="">
      <div className="">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-(--primary-bg) rounded-custom p-8 shadow-custom"
        >
          <h3 className="text-2xl font-bold mb-8 text-(--text-color)">
            Get in Touch
          </h3>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="w-full px-4 py-2 rounded-custom border border-(--border) bg-(--secondary-bg) focus:ring-1 focus:ring-(--border) outline-none transition-all shadow-custom text-(--text-color)"
                />
                {getFormikError(formik, "name")}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-4 py-2 rounded-custom border border-(--border) bg-(--secondary-bg) focus:ring-1 focus:ring-(--border) outline-none transition-all shadow-custom text-(--text-color)"
                />
                {getFormikError(formik, "email")}
              </div>
            </div>

            {/* Phone & Subject Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="phone-input-container">
                <PhoneInput
                  country={"in"}
                  value={formik.values.mobile_no}
                  onChange={(value) => formik.setFieldValue("mobile_no", value)}
                  onBlur={() => formik.setFieldTouched("mobile_no", true)}
                  inputProps={{
                    name: "mobile_no",
                    required: true,
                  }}
                  containerClass="!w-full"
                  inputClass="!w-full !h-full !px-4 !py-3 !pl-12 !rounded-custom !border !border-(--border) !bg-(--secondary-bg) !text-(--text-color) !transition-all !shadow-custom !outline-none focus:!ring-1 focus:!ring-(--border)"
                  buttonClass="!bg-transparent !border-r !border-(--border) !rounded-l-custom"
                  dropdownClass="!bg-(--primary-bg) !text-(--text-color)"
                />
                {getFormikError(formik, "mobile_no")}
              </div>
              <div>
                <input
                  name="subject"
                  type="subject"
                  placeholder="Enter Subject"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subject}
                  className="w-full px-4 py-2 rounded-custom border border-(--border) bg-(--secondary-bg) focus:ring-1 focus:ring-(--border) outline-none transition-all shadow-custom text-(--text-color)"
                />
                {getFormikError(formik, "subject")}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <textarea
                name="message"
                rows={5}
                placeholder="Write Message..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className="w-full px-4 py-3 rounded-custom border border-(--border) bg-(--secondary-bg) focus:ring-1 focus:ring-(--border) outline-none transition-all shadow-custom text-(--text-color)"
              ></textarea>
              {getFormikError(formik, "message")}
            </div>

            <Button
              type="submit"
              label={formik.isSubmitting ? "Sending..." : "Send Message"}
              disabled={formik.isSubmitting}
            />
          </form>
        </motion.div>
      </div>
    </section>
  );
}
