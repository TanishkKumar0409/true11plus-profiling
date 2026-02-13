import { useFormik } from "formik";
import { motion } from "framer-motion";
import { InputGroup, TextareaGroup } from "../../../../ui/form/FormComponents";
import { ButtonGroup, SecondButton } from "../../../../ui/buttons/Button";
import { userExperienceValidation } from "../../../../contexts/ValidationSchema";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import type { UserExperience } from "../../../../types/UserTypes";
import { useState, useEffect } from "react";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";

interface ExperienceFormProps {
  initialData: UserExperience;
  onCancel: () => void;
  editingId: string | null;
  getExperience: () => void;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExperienceForm = ({
  initialData,
  onCancel,
  editingId,
  getExperience,
  setEditingId,
  setIsEditing,
}: ExperienceFormProps) => {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: userExperienceValidation,
    onSubmit: async (values, { resetForm }) => {
      startLoadingBar();
      setIsLoading(true);
      const payload = editingId
        ? { ...values, experienceId: editingId }
        : values;
      try {
        const response = await API.patch("/user/add/experience", payload);
        getSuccessResponse(response);
        getExperience();
        resetForm();
        setIsEditing(false);
        setEditingId(null);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
        stopLoadingBar();
      }
    },
  });

  useEffect(() => {
    if (formik.values.iscurrently) {
      formik.setFieldValue("end_date", "");
    }
  }, [formik.values.iscurrently]);

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={formik.handleSubmit}
      className="bg-(--secondary-bg) p-6 rounded-custom shadow-custom mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <InputGroup
            label="Job Title"
            placeholder="Enter Your Job Title"
            id="title"
            {...formik.getFieldProps("title")}
          />
          {getFormikError(formik, "title")}
        </div>

        <div>
          <InputGroup
            label="Company"
            placeholder="Enter Company Name"
            id="company"
            {...formik.getFieldProps("company")}
          />
          {getFormikError(formik, "company")}
        </div>

        <div>
          <InputGroup
            label="Start Date"
            type="month"
            id="start_date"
            {...formik.getFieldProps("start_date")}
          />
          {getFormikError(formik, "start_date")}
        </div>

        <div>
          <InputGroup
            label="End Date"
            id="end_date"
            type="month"
            disabled={formik.values.iscurrently}
            {...formik.getFieldProps("end_date")}
          />
          {getFormikError(formik, "end_date")}
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="iscurrently"
            {...formik.getFieldProps("iscurrently")}
            checked={formik.values.iscurrently}
            className="w-4 h-4 rounded border-(--border) text-(--main) cursor-pointer"
          />
          <label
            htmlFor="iscurrently"
            className="text-sm text-(--text-color) cursor-pointer"
          >
            I currently work here
          </label>
        </div>

        <div className="md:col-span-2">
          <TextareaGroup
            label="Description"
            placeholder="What did you do there?"
            rows={4}
            id="description"
            {...formik.getFieldProps("description")}
          />
          {getFormikError(formik, "description")}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-(--border)">
        <SecondButton label="Cancel" type="button" onClick={onCancel} />
        <ButtonGroup
          type="submit"
          label={isLoading ? "Saving..." : "Save Experience"}
          disable={isLoading}
        />
      </div>
    </motion.form>
  );
};
