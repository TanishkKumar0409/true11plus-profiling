import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { getEditorConfig } from "../../../common/JoditEditorConfig";
import { API } from "../../../contexts/API";
import {
  getCategoryAccodingToField,
  getErrorResponse,
  getFormikError,
} from "../../../contexts/Callbacks";
import { Breadcrumbs } from "../../../ui/breadcrumbs/Breadcrumbs";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { durationType } from "../../../common/ExtraData";
import { taskValidation } from "../../../contexts/ValidationSchema";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

interface AcademicGroupOption {
  _id: string;
  academic_group: string;
}

export default function CreateTask() {
  const { allCategory } = useOutletContext<DashboardOutletContextProps>();
  const navigate = useNavigate();
  const [academicGroups, setAcademicGroups] = useState<AcademicGroupOption[]>(
    [],
  );

  const objectiveEditor = useRef(null);
  const stepsEditor = useRef(null);
  const deliverablesEditor = useRef(null);
  const detailsEditor = useRef(null);

  const editorConfig = useMemo(() => getEditorConfig(), []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await API.get("/academic/group/all");
        setAcademicGroups(response.data);
      } catch (error) {
        console.error("Failed to load academic groups");
      }
    };
    fetchGroups();
  }, []);

  const formik = useFormik({
    initialValues: {
      academic_group_id: "",
      title: "",
      difficulty_level: "Medium",
      duration_value: "",
      duration_type: "Days",
      task_type: "",
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

        const response = await API.post("/task/create", payload);
        toast.success(response.data.message || "Task Created Successfully");
        navigate("/dashboard/tasks");
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6 mx-auto max-w-7xl pb-10">
      <Breadcrumbs
        title="Create New Task"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tasks", path: "/dashboard/tasks" },
          { label: "Create" },
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
              <label className={labelClass}>Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formik.values.difficulty_level}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  --select level--
                </option>
                {getCategoryAccodingToField(
                  allCategory,
                  "task difficulty level",
                )?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.category_name}
                  </option>
                ))}
              </select>
              {getFormikError(formik, "difficulty_level")}
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

            {/* FIXED SECTION: Task Type */}
            <div>
              <label className={labelClass}>Task Type (Pillar)</label>
              <select
                name="task_type"
                value={formik.values.task_type}
                onChange={formik.handleChange}
                className={`${inputClass} capitalize`}
              >
                <option value="" disabled>
                  --select type--
                </option>
                {getCategoryAccodingToField(allCategory, "pillar")?.map(
                  (cat) => (
                    <option key={cat?._id} value={cat?._id}>
                      {cat?.category_name}
                    </option>
                  ),
                )}
              </select>
              {getFormikError(formik, "task_type")}
            </div>
          </div>

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
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {formik.isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}