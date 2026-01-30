import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { getEditorConfig } from "../../../common/JoditEditorConfig";
import { API } from "../../../contexts/API";
import {
  getCategoryAccodingToField,
  getErrorResponse,
  getFormikError,
  getStatusAccodingToField,
} from "../../../contexts/Callbacks";
import { taskValidation } from "../../../contexts/ValidationSchema";
import { Breadcrumbs } from "../../../ui/breadcrumbs/Breadcrumbs";
import { durationType } from "../../../common/ExtraData";
import type { AcademicGroupProps } from "../../../types/AcademicStructureType";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

interface AcademicGroupOption {
  _id: string;
  academic_group: string;
}

export default function EditTask() {
  const { objectId } = useParams();
  const { allCategory, allStatus } =
    useOutletContext<DashboardOutletContextProps>();
  const navigate = useNavigate();

  const [academicGroups, setAcademicGroups] = useState<AcademicGroupOption[]>(
    [],
  );
  const [loadingData, setLoadingData] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const objectiveEditor = useRef(null);
  const stepsEditor = useRef(null);
  const deliverablesEditor = useRef(null);
  const detailsEditor = useRef(null);

  const editorConfig = useMemo(() => getEditorConfig(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);

      const [taskRes, groupsRes] = await Promise.all([
        API.get(`/task/${objectId}`),
        API.get("/academic/group/all"),
      ]);

      const data = groupsRes.data;
      setAcademicGroups(
        data?.filter((item: AcademicGroupProps) => item?.status === "active"),
      );
      const task = taskRes.data;

      setInitialData({
        academic_group_id:
          typeof task.academic_group_id === "object"
            ? task.academic_group_id?._id
            : task.academic_group_id,
        title: task.title,
        status: task.status,
        difficulty_level:
          typeof task.difficulty_level === "object"
            ? task.difficulty_level?._id
            : task.difficulty_level,
        task_type:
          typeof task.task_type === "object"
            ? task.task_type?._id
            : task.task_type || "",
        duration_value: task.duration?.duration_value || "",
        duration_type: task.duration?.duration_type || "Day",
        objective: task.objective || "",
        steps_to_implement: task.steps_to_implement || "",
        final_deliverable: task.final_deliverable || "",
        important_details: task.important_details || "",
      });
    } catch (error) {
      getErrorResponse(error, true);
      navigate("/dashboard/tasks");
    } finally {
      setLoadingData(false);
    }
  }, [objectId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData || {
      academic_group_id: "",
      title: "",
      status: "",
      difficulty_level: "",
      task_type: "",
      duration_value: "",
      duration_type: "Days",
      objective: "",
      steps_to_implement: "",
      final_deliverable: "",
      important_details: "",
    },
    validationSchema: taskValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload = {
          ...values,
          duration_value: Number(values.duration_value),
        };

        const response = await API.patch(`/task/update/${objectId}`, payload);
        toast.success(response.data.message || "Task Updated Successfully");
        navigate(`/dashboard/tasks`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-125 flex-col gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-purple-600 font-medium animate-pulse">
          Loading Task Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto max-w-7xl pb-10">
      <Breadcrumbs
        title="Edit Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tasks", path: "/dashboard/tasks" },
          {
            label: initialData?.title || "Task Details",
            path: `/dashboard/task/${objectId}`,
          },
          { label: "Edit" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Task Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                placeholder="e.g., Build a Portfolio Website"
                className={inputClass}
              />
              {getFormikError(formik, "title")}
            </div>

            <div>
              <label className={labelClass}>Academic Group</label>
              <select
                name="academic_group_id"
                value={formik.values.academic_group_id}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  -- Select Group --
                </option>
                {academicGroups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.academic_group}
                  </option>
                ))}
              </select>
              {getFormikError(formik, "academic_group_id")}
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  Set Status
                </option>
                {getStatusAccodingToField(allStatus, "task").map((s, i) => (
                  <option key={i} value={s.status_name}>
                    {s.status_name}
                  </option>
                ))}
              </select>
              {getFormikError(formik, "status")}
            </div>

            <div>
              <label className={labelClass}>Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formik.values.difficulty_level}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  -- Select Level --
                </option>
                {getCategoryAccodingToField(
                  allCategory,
                  "task difficulty level",
                )?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {getFormikError(formik, "difficulty_level")}
            </div>

            <div>
              <label className={labelClass}>Task Type (Pillar)</label>
              <select
                name="task_type"
                value={formik.values.task_type}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  -- Select Type --
                </option>
                {getCategoryAccodingToField(allCategory, "pillar")?.map(
                  (cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </option>
                  ),
                )}
              </select>
              {getFormikError(formik, "task_type")}
            </div>

            <div>
              <label className={labelClass}>Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="duration_value"
                  value={formik.values.duration_value}
                  onChange={formik.handleChange}
                  placeholder="e.g., 2"
                  className={inputClass}
                  min="1"
                />
                <select
                  name="duration_type"
                  value={formik.values.duration_type}
                  onChange={formik.handleChange}
                  className={`${inputClass} capitalize`}
                >
                  {durationType?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              {getFormikError(formik, "duration_value")}
              {getFormikError(formik, "duration_type")}
            </div>
          </div>

          {/* Editors Section */}
          <div className="space-y-8">
            <div>
              <label className={labelClass}>Objective</label>
              <div className="prose-editor">
                <JoditEditor
                  ref={objectiveEditor}
                  value={formik.values.objective}
                  config={editorConfig}
                  onBlur={(content) =>
                    formik.setFieldValue("objective", content)
                  }
                />
              </div>
              {getFormikError(formik, "objective")}
            </div>

            <div>
              <label className={labelClass}>Steps to Implement</label>
              <div className="prose-editor">
                <JoditEditor
                  ref={stepsEditor}
                  value={formik.values.steps_to_implement}
                  config={editorConfig}
                  onBlur={(content) =>
                    formik.setFieldValue("steps_to_implement", content)
                  }
                />
              </div>
              {getFormikError(formik, "steps_to_implement")}
            </div>

            <div>
              <label className={labelClass}>Final Deliverable</label>
              <div className="prose-editor">
                <JoditEditor
                  ref={deliverablesEditor}
                  value={formik.values.final_deliverable}
                  config={editorConfig}
                  onBlur={(content) =>
                    formik.setFieldValue("final_deliverable", content)
                  }
                />
              </div>
              {getFormikError(formik, "final_deliverable")}
            </div>

            <div>
              <label className={labelClass}>Important Details / Notes</label>
              <div className="prose-editor">
                <JoditEditor
                  ref={detailsEditor}
                  value={formik.values.important_details}
                  config={editorConfig}
                  onBlur={(content) =>
                    formik.setFieldValue("important_details", content)
                  }
                />
              </div>
              {getFormikError(formik, "important_details")}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {formik.isSubmitting ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
