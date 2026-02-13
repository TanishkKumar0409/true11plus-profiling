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
import { customStyles } from "../../../../common/ExtraData";
import type {
  AcademicClassProps,
  AcademicGroupProps,
} from "../../../../types/AcademicStructureType";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { InputGroup, SelectGroup } from "../../../../ui/form/FormComponents";
import { ButtonGroup, SecondButton } from "../../../../ui/button/Button";

interface ClassOption {
  value: string;
  label: string;
}

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
  const { allStatus, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
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
      startLoadingBar();
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
        stopLoadingBar();
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-(--primary-bg) rounded-custom shadow-custom">
        <div className="px-8 py-6">
          <p className="font-bold text-(--text-color) ">
            {isEditMode
              ? "Update group name, status, or modify assigned classes."
              : "Define a new group and assign associated classes."}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={isEditMode ? "" : "md:col-span-2"}>
              <InputGroup
                id="academic_group"
                label="Academic Group Name"
                placeholder="e.g., Primary Section, Science Stream"
                {...formik.getFieldProps("academic_group")}
              />
              {getFormikError(formik, "academic_group")}
            </div>

            {isEditMode && (
              <div>
                <SelectGroup
                  label="Status"
                  {...formik.getFieldProps("status")}
                  id="status"
                  options={
                    getStatusAccodingToField(allStatus, "academic group")
                      ?.filter((item) => item?.status_name)
                      ?.map((item) => item.status_name) || []
                  }
                />
                {getFormikError(formik, "status")}
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs text-(--text-color) mb-1">
                Assign Classes
              </label>
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
                styles={customStyles}
                placeholder="Select classes..."
              />
              {getFormikError(formik, "academic_classess")}
              <p className="text-xs text-(--text-color) mt-1.5 ml-1">
                You can select multiple classes for this group.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <SecondButton onClick={() => setIsAdding(false)} label="Cancel" />
            <ButtonGroup
              type="submit"
              disable={formik.isSubmitting}
              label={
                formik.isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Group"
                    : "Create Group"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
