import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import toast from "react-hot-toast";
import { API } from "../../../../contexts/API";
import {
  getErrorResponse,
  getFormikError,
  getStatusAccodingToField,
} from "../../../../contexts/Callbacks";
import { reactSelectDesignClass } from "../../../../common/ExtraData";
import type {
  AcademicClassProps,
  AcademicGroupProps,
} from "../../../../types/AcademicStructureType";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";

interface ClassOption {
  value: string;
  label: string;
}

const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";
const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";

interface AcademicGroupCreateProps {
  allAcademicClasses: AcademicClassProps[];
  setIsAdding: React.Dispatch<
    React.SetStateAction<AcademicGroupProps | boolean>
  >;
  isAdding: AcademicGroupProps | boolean;
  getAllAcademicGroups: () => void;
}

export default function AcademicGroupCreate({
  allAcademicClasses,
  setIsAdding,
  isAdding,
  getAllAcademicGroups,
}: AcademicGroupCreateProps) {
  const { allStatus } = useOutletContext<DashboardOutletContextProps>();
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);

  useEffect(() => {
    if (allAcademicClasses) {
      const options = allAcademicClasses.map((item) => ({
        label: item?.academic_class,
        value: item?._id,
      }));
      setClassOptions(options);
    }
  }, [allAcademicClasses]);

  const isEditMode = typeof isAdding === "object" && isAdding !== null;
  const initialData = isEditMode ? (isAdding as AcademicGroupProps) : null;

  const getInitialClasses = () => {
    if (!initialData?.academic_classess) return [];
    return classOptions.filter((opt) =>
      initialData.academic_classess.some(
        (c: any) => (typeof c === "string" ? c : c._id) === opt.value,
      ),
    );
  };

  const [initialSelectedClasses, setInitialSelectedClasses] = useState<
    ClassOption[]
  >([]);

  useEffect(() => {
    if (isEditMode && classOptions.length > 0) {
      setInitialSelectedClasses(getInitialClasses());
    }
  }, [classOptions, isAdding]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      academic_group: initialData?.academic_group || "",
      academic_classess: initialSelectedClasses,
      status: initialData?.status || "active",
    },
    validationSchema: Yup.object({
      academic_group: Yup.string().required("Academic Group Name is required"),
      academic_classess: Yup.array().min(1, "Select at least one class"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload: any = {
          group_id: initialData?._id,
          academic_group: values.academic_group,
          academic_classess: values.academic_classess.map((c: any) => c.value),
          status: values.status,
        };

        if (isEditMode && initialData?._id) {
          payload.id = initialData._id;
        }

        const response = await API.post("/academic/group/create", payload);
        toast.success(response.data.message || "Saved Successfully");
        getAllAcademicGroups();
        setIsAdding(false);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Academic Group" : "Create Academic Group"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode
              ? "Update group name, status, or modify assigned classes."
              : "Define a new group and assign associated classes."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Name */}
            <div className={isEditMode ? "" : "md:col-span-2"}>
              <label className={labelClass}>Academic Group Name</label>
              <input
                type="text"
                name="academic_group"
                value={formik.values.academic_group}
                onChange={formik.handleChange}
                placeholder="e.g., Primary Section, Science Stream"
                className={inputClass}
              />
              {getFormikError(formik, "academic_group")}
            </div>

            {/* Status Dropdown - ONLY Visible in Edit Mode */}
            {isEditMode && (
              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  className={inputClass}
                >
                  {getStatusAccodingToField(allStatus, "academic group").map(
                    (s, i) => (
                      <option key={i} value={s.status_name}>
                        {s.status_name}
                      </option>
                    ),
                  )}
                </select>
                {getFormikError(formik, "status")}
              </div>
            )}

            {/* Classes Select - Full Width */}
            <div className="md:col-span-2">
              <label className={labelClass}>Assign Classes</label>
              <Select
                isMulti
                name="academic_classess"
                options={classOptions}
                value={formik.values.academic_classess}
                onChange={(selected) =>
                  formik.setFieldValue("academic_classess", selected)
                }
                onBlur={() => formik.setFieldTouched("academic_classess", true)}
                classNamePrefix="select"
                classNames={reactSelectDesignClass}
                placeholder="Select classes..."
              />
              {getFormikError(formik, "academic_classess")}
              <p className="text-xs text-gray-400 mt-1.5 ml-1">
                You can select multiple classes for this group.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {formik.isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Group"
                  : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
