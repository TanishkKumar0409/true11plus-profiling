import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  BiBriefcase,
  BiBuilding,
  BiCalendar,
  BiPlus,
  BiPencil,
  BiCheck,
  BiTrash,
} from "react-icons/bi";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { userExperienceValidation } from "../../../../contexts/ValidationSchema"; // Ensure this file has the schema you provided
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import type { UserExperience } from "../../../../types/UserTypes";
import Swal from "sweetalert2";

export default function ExperienceDetails() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getExperience = useCallback(async () => {
    if (!authUser?._id) return;
    try {
      const response = await API.get(`/user/experience/${authUser._id}`);
      setExperiences(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [authUser?._id]);

  useEffect(() => {
    getExperience();
  }, [getExperience]);

  // --- GROUPING LOGIC ---
  const groupedExperiences = useMemo(() => {
    const groups: Record<string, UserExperience[]> = {};

    // 1. Group by Company Name
    experiences.forEach((exp) => {
      const companyKey = exp.company.trim();
      if (!groups[companyKey]) {
        groups[companyKey] = [];
      }
      groups[companyKey].push(exp);
    });

    // 2. Sort roles within company by Start Date (Newest first)
    Object.keys(groups).forEach(company => {
      groups[company].sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });
    });

    return groups;
  }, [experiences]);

  const initialValues: UserExperience = {
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    iscurrently: false,
    description: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editingId
      ? experiences.find((ex) => ex._id === editingId) || initialValues
      : initialValues,
    validationSchema: userExperienceValidation,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      const payload = editingId ? { ...values, experienceId: editingId } : values;
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
      }
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    formik.resetForm();
    setIsEditing(true);
  };

  const handleEdit = (item: UserExperience) => {
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
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          const response = await API.delete(`/user/delete/experience/${id}`);
          getSuccessResponse(response);
          getExperience();
        }
      } catch (error) {
        getErrorResponse(error);
      }
    },
    [getExperience]
  );

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Experience</h2>
          <p className="text-sm text-gray-500">
            Add your professional work history.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
          >
            <BiPlus size={18} /> Add Experience
          </button>
        )}
      </div>

      {/* --- FORM SECTION --- */}
      {isEditing ? (
        <form
          onSubmit={formik.handleSubmit}
          className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BiBriefcase className="text-purple-600" />
              {editingId ? "Edit Experience" : "Add New Experience"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex. Senior Software Engineer"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                />
                {getFormikError(formik, "title")}
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Ex. Google Inc."
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                />
                {getFormikError(formik, "company")}
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">
                  Start Date *
                </label>
                <input
                  type="month"
                  name="start_date"
                  value={formik.values.start_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                />
                {getFormikError(formik, "start_date")}
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">
                  End Date {formik.values.iscurrently && "(Optional)"}
                </label>
                <input
                  type="month"
                  name="end_date"
                  value={formik.values.end_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.values.iscurrently}
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none disabled:bg-gray-100 disabled:text-gray-400 bg-white"
                />
                {getFormikError(formik, "end_date")}
              </div>

              {/* Checkbox (Updated name to iscurrently) */}
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="iscurrently"
                  name="iscurrently"
                  checked={formik.values.iscurrently}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="iscurrently"
                  className="text-sm text-gray-700 select-none cursor-pointer"
                >
                  I am currently working in this role
                </label>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600">
                    Description
                  </label>
                  <span
                    className={`text-xs ${formik.values.description.length > 500
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {formik.values.description.length}/500
                  </span>
                </div>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe your responsibilities..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none resize-none"
                />
                {getFormikError(formik, "description")}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <BiCheck size={18} />
                )}
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {/* --- LIST SECTION (GROUPED) --- */}
      <div className="space-y-8">
        {Object.keys(groupedExperiences).length === 0 && !isEditing ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <BiBriefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              No experience details added yet.
            </p>
          </div>
        ) : (
          Object.entries(groupedExperiences).map(([companyName, companyRoles], groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Company Header */}
              <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <BiBuilding className="text-purple-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">{companyName}</h3>
              </div>

              {/* Roles Timeline */}
              <div className="p-5 pb-2">
                {companyRoles.map((role, roleIndex) => (
                  <div key={role._id} className="relative pl-8 pb-6 last:pb-0 group">

                    {/* Timeline Line (Only show if not the last item in the group) */}
                    {roleIndex !== companyRoles.length - 1 && (
                      <div className="absolute top-2 left-[7px] w-[2px] h-full bg-gray-200 group-last:hidden"></div>
                    )}

                    {/* Timeline Dot */}
                    <div className="absolute top-1.5 left-0 w-4 h-4 rounded-full border-2 border-white bg-gray-200 group-hover:bg-purple-500 transition-colors shadow-sm z-10"></div>

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {role.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <BiCalendar size={14} />
                          <span>
                            {role.start_date} —{" "}
                            {role.iscurrently ? (
                              <span className="text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded text-[10px]">
                                Present
                              </span>
                            ) : (
                              role.end_date
                            )}
                          </span>
                        </div>

                        {role.description && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap border-l-2 border-gray-100 pl-3">
                            {role.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button
                          onClick={() => handleEdit(role)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Edit Role"
                        >
                          <BiPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(role._id || "")}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Role"
                        >
                          <BiTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}