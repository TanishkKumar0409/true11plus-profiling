import { useCallback, useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import { BiSolidGraduation, BiCalendar, BiPlus, BiPencil, BiCheck, BiTrash, BiBuilding, } from "react-icons/bi";
import { getErrorResponse, getFormikError, getSuccessResponse, } from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { CLASS_OPTIONS } from "../../../../common/ExtraData";
import type { UserEducation } from "../../../../types/UserTypes";
import { userEducationValidation } from "../../../../contexts/ValidationSchema";

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: currentYear - 1980 + 6 },
    (_, i) => currentYear - i
);
export default function EducationDetails() {
    const { authUser } = useOutletContext<DashboardOutletContextProps>();
    const [educations, setEducations] = useState<UserEducation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const getEducation = useCallback(async () => {
        if (!authUser?._id) return;
        try {
            const response = await API.get(`user/education/${authUser._id}`);
            setEducations(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        }
    }, [authUser?._id]);

    useEffect(() => {
        getEducation();
    }, [getEducation]);

    // --- Grouping Logic ---
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
            } catch (error) {
                getErrorResponse(error);
            } finally {
                setIsLoading(false);
                resetForm();
                setIsEditing(false);
                setEditingId(null);
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
                    const response = await API.delete(`/user/delete/education/${id}`);
                    getSuccessResponse(response);
                    getEducation();
                }
            } catch (error) {
                getErrorResponse(error);
            }
        },
        [getEducation]
    );

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Education</h2>
                    <p className="text-sm text-gray-500">
                        Add your school academic details.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
                    >
                        <BiPlus size={18} /> Add Education
                    </button>
                )}
            </div>

            {isEditing ? (
                <form
                    onSubmit={formik.handleSubmit}
                    className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BiSolidGraduation className="text-purple-600" />
                            {editingId ? "Edit Education" : "Add New Education"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    School Name *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="school"
                                        placeholder="Ex. Delhi Public School"
                                        value={formik.values.school}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <BiBuilding />
                                    </div>
                                </div>
                                {getFormikError(formik, "school")}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    Class *
                                </label>
                                <div className="relative">
                                    <select
                                        name="student_class"
                                        value={formik.values.student_class}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white"
                                    >
                                        <option value="" disabled>
                                            Select Class
                                        </option>
                                        {CLASS_OPTIONS.map((cls) => (
                                            <option key={cls} value={cls}>
                                                {cls}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {getFormikError(formik, "student_class")}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    Academic Year
                                </label>
                                <div className="relative">
                                    <select
                                        name="academic_year"
                                        value={formik.values.academic_year}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.values.pursuing}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="" disabled>
                                            Select Year
                                        </option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {!formik.values.pursuing &&
                                    getFormikError(formik, "academic_year")}
                            </div>

                            {/* Pursuing Checkbox */}
                            <div className="flex items-end pb-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="pursuing"
                                        name="pursuing"
                                        checked={formik.values.pursuing}
                                        onChange={formik.handleChange}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="pursuing"
                                        className="text-sm text-gray-700 select-none cursor-pointer"
                                    >
                                        Currently Pursuing
                                    </label>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="md:col-span-2 space-y-1">
                                <div className="flex justify-between">
                                    <label className="text-xs font-semibold text-gray-600">
                                        Description
                                    </label>
                                    <span
                                        className={`text-xs ${(formik.values.description?.length || 0) > 500
                                            ? "text-red-500"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {formik.values.description?.length || 0}/500
                                    </span>
                                </div>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Achievements, subjects, or extra-curricular activities..."
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none"
                                />
                                {getFormikError(formik, "description")}
                            </div>
                        </div>

                        {/* Form Actions */}
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

            {/* --- LIST SECTION (Grouped by School) --- */}
            <div className="space-y-8">
                {Object.keys(groupedEducations).length === 0 && !isEditing ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <BiSolidGraduation className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                            No education details added yet.
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedEducations).map(
                        ([schoolName, schoolEducations]) => (
                            <div
                                key={schoolName}
                                className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden"
                            >
                                {/* School Header */}
                                <div className="bg-white px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                        <BiBuilding size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-base">
                                        {schoolName}
                                    </h3>
                                </div>

                                {/* List of Classes for this School */}
                                <div className="p-4 space-y-4">
                                    {schoolEducations.map((edu) => (
                                        <div
                                            key={edu._id}
                                            className="relative pl-6 border-l-2 border-purple-200 last:border-0 ml-2"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute top-1.5 -left-[7px] w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white"></div>

                                            <div className="flex justify-between items-start group">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-gray-800">
                                                            {edu.student_class}
                                                        </h4>
                                                        <span
                                                            className={`text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 ${edu.pursuing
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-200 text-gray-600"
                                                                }`}
                                                        >
                                                            {edu.pursuing ? (
                                                                "Pursuing"
                                                            ) : (
                                                                <>
                                                                    <BiCalendar size={10} /> {edu.academic_year}
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {edu.description && (
                                                        <p className="text-sm text-gray-500 leading-relaxed">
                                                            {edu.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                                    <button
                                                        onClick={() => handleEdit(edu)}
                                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-white rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <BiPencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(edu._id || "")}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <BiTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )))}
            </div>
        </div>
    );
}