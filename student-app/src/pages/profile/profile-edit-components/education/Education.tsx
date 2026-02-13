import { useCallback, useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import {
  BiSolidGraduation,
  BiPencil,
  BiTrash,
  BiBuilding,
} from "react-icons/bi";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { AnimatePresence, motion } from "framer-motion";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { CLASS_OPTIONS } from "../../../../common/ExtraData";
import type { UserEducation } from "../../../../types/UserTypes";
import { userEducationValidation } from "../../../../contexts/ValidationSchema";
import { ButtonGroup, SecondButton } from "../../../../ui/buttons/Button";
import {
  InputGroup,
  SelectGroup,
  TextareaGroup,
} from "../../../../ui/form/FormComponents";
import ProfileEditSkeleton from "../../../../ui/loading/pages/ProfileEditSkeleton";

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1980 + 6 },
  (_, i) => currentYear - i,
);

export default function EducationDetails() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [educations, setEducations] = useState<UserEducation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getEducation = useCallback(async () => {
    startLoadingBar();
    setIsLoading(true);
    if (!authUser?._id) return;
    try {
      const response = await API.get(`user/education/${authUser._id}`);
      setEducations(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      stopLoadingBar();
      setIsLoading(false);
    }
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);

  const groupedEducations = useMemo(() => {
    const groups: Record<string, UserEducation[]> = {};
    educations.forEach((edu) => {
      const schoolKey = edu.school.trim();
      if (!groups[schoolKey]) {
        groups[schoolKey] = [];
      }
      groups[schoolKey].push(edu);
    });
    return groups;
  }, [educations]);

  const initialValues: UserEducation = {
    student_class: "",
    school: "",
    academic_year: "",
    description: "",
    pursuing: false,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editingId
      ? educations.find((edu) => edu._id === editingId) || initialValues
      : initialValues,
    validationSchema: userEducationValidation,
    onSubmit: async (values, { resetForm }) => {
      startLoadingBar();
      setIsLoading(true);
      const cleanValues = {
        ...values,
        academic_year: values.pursuing ? "" : values.academic_year,
      };

      const payload = editingId
        ? { ...cleanValues, educationId: editingId }
        : cleanValues;

      try {
        const response = await API.patch("/user/add/education", payload);
        getSuccessResponse(response);
        getEducation();
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

  const handleAddNew = () => {
    setEditingId(null);
    formik.resetForm();
    setIsEditing(true);
  };

  const handleEdit = (item: UserEducation) => {
    if (item._id) {
      setEditingId(item._id);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    formik.resetForm();
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          startLoadingBar();
          const response = await API.delete(`/user/delete/education/${id}`);
          getSuccessResponse(response);
          getEducation();
        }
      } catch (error) {
        getErrorResponse(error);
      } finally {
        stopLoadingBar();
      }
    },
    [getEducation, startLoadingBar, stopLoadingBar],
  );

  if (isLoading) return <ProfileEditSkeleton />;
  return (
    <div className="w-full bg-(--primary-bg) p-6 rounded-custom shadow-custom">
      <div className="flex justify-between items-center mb-8 border-b border-(--border) pb-4">
        <div>
          <p className="font-medium text-(--text-color)">
            Your academic history and qualifications.
          </p>
        </div>
        {!isEditing && (
          <ButtonGroup label="Add Education" onClick={handleAddNew} />
        )}
      </div>
      <AnimatePresence mode="wait">
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={formik.handleSubmit}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-(--secondary-bg) p-5 shadow-custom rounded-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputGroup
                    label="School/University"
                    placeholder="Ex. IIT Delhi"
                    id="school"
                    {...formik.getFieldProps("school")}
                  />
                  {getFormikError(formik, "school")}
                </div>
                <div>
                  <SelectGroup
                    label="Class"
                    id="student_class"
                    options={CLASS_OPTIONS}
                    placeholder="Select Class"
                    value={formik.values.student_class}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFormikError(formik, "student_class")}
                </div>
                <div>
                  {/* Since SelectGroup doesn't support 'disabled', we conditionally hide or wrap logic */}
                  <SelectGroup
                    label="Passing Year"
                    id="academic_year"
                    options={years.map(String)}
                    placeholder="Select Year"
                    value={
                      formik.values.pursuing ? "" : formik.values.academic_year
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {!formik.values.pursuing &&
                    getFormikError(formik, "academic_year")}
                </div>

                <div className="flex items-center gap-2 pt-2 group">
                  <input
                    type="checkbox"
                    id="pursuing"
                    name="pursuing"
                    checked={formik.values.pursuing}
                    onChange={formik.handleChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="pursuing"
                    className="paragraph select-none group-hover:text-(--main)!"
                  >
                    Currently Pursuing
                  </label>
                </div>

                <div className="md:col-span-2">
                  <TextareaGroup
                    label="Description"
                    placeholder="Achievements, scores, or societies..."
                    id="description"
                    {...formik.getFieldProps("description")}
                    rows={3}
                  />
                  {getFormikError(formik, "description")}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <SecondButton
                  label="Cancel"
                  type="button"
                  onClick={handleCancel}
                />
                <ButtonGroup
                  label={
                    isLoading
                      ? editingId
                        ? "Updating..."
                        : "Saving..."
                      : editingId
                        ? "Update"
                        : "Save"
                  }
                  type="submit"
                  disable={isLoading || !formik.isValid}
                />
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-8 mt-4">
        {Object.keys(groupedEducations).length === 0 && !isEditing ? (
          <div className="text-center py-16 flex flex-col items-center border-2 border-dashed border-(--border) hover:border-(--main) opacity-100 space-y-3 rounded-custom">
            <BiSolidGraduation size={64} className="text-(--main)" />
            <h4>No education details added yet.</h4>
            <ButtonGroup
              onClick={handleAddNew}
              label="Add Your First Adademic Record"
            />
          </div>
        ) : (
          Object.entries(groupedEducations).map(
            ([schoolName, schoolEducations]) => (
              <div
                key={schoolName}
                className="relative pl-10 border-l-2 border-(--border) ml-4"
              >
                <div className="absolute -left-5 top-0 bg-(--primary-bg) py-1">
                  <div className="w-10 h-10 rounded-full bg-(--main) flex items-center justify-center shadow-md">
                    <BiBuilding className="text-(--white) w-5 h-5" />
                  </div>
                </div>
                <h4 className="mb-4 pt-2">{schoolName}</h4>
                <div className="space-y-4">
                  {schoolEducations.map((edu, index) => (
                    <motion.div
                      layout
                      key={edu._id || index}
                      className="group relative bg-(--secondary-bg) p-4 transition-all rounded-custom shadow-custom"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-(--text-color-emphasis) flex items-center gap-2">
                            {edu.student_class}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                edu.pursuing
                                  ? "bg-(--success-subtle) text-(--success)"
                                  : "bg-(--main-subtle) text-(--main)"
                              }`}
                            >
                              {edu.pursuing
                                ? "Currently Pursuing"
                                : `Class of ${edu.academic_year}`}
                            </span>
                          </h5>
                          {edu.description && (
                            <p className="text-(--text-color) mt-2 italic">
                              "{edu.description}"
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <button
                            type="button"
                            onClick={() => handleEdit(edu)}
                            className="p-2 text-(--main) hover:text-(--main-subtle) bg-(--main-subtle) hover:bg-(--main) rounded-md transition-colors"
                            title="Edit"
                          >
                            <BiPencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(edu._id || "")}
                            className="p-2 text-(--danger) hover:text-(--danger-subtle) bg-(--danger-subtle) hover:bg-(--danger) rounded-md transition-colors"
                            title="Delete"
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
