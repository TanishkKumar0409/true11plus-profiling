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
import { InputGroup, SelectGroup } from "../../../ui/form/FormComponents";
import { ButtonGroup } from "../../../ui/button/Button";
import UserEditSkeleton from "../../../ui/loading/pages/UserEditSkeleton";

const inputClass =
  "w-full text-xs border border-(--border) bg-(--primary-bg) text-(--text-color-emphasis) rounded-custom p-2 appearance-none focus:ring-1 focus:ring-(--border) outline-none font-semibold";
const labelClass = "block text-xs text-(--text-color) mb-1";

interface AcademicGroupOption {
  _id: string;
  academic_group: string;
}

export default function EditTask() {
  const { objectId } = useParams();
  const { allCategory, allStatus, startLoadingBar, stopLoadingBar } =
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
    startLoadingBar();
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
      stopLoadingBar();
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

  if (loadingData) return <UserEditSkeleton />;

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

      <div className="bg-(--primary-bg) rounded-custom shadow-custom">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputGroup
                label="Task Title"
                id="title"
                placeholder="e.g., Build a Portfolio Website"
                {...formik.getFieldProps("title")}
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
                <div className="w-full">
                  <InputGroup
                    type="number"
                    id="duration_value"
                    placeholder="e.g., 2"
                    {...formik.getFieldProps("duration_value")}
                    min={1}
                  />
                </div>
                <div className="w-full">
                  <SelectGroup
                    options={durationType}
                    id="duration_type"
                    {...formik.getFieldProps("duration_type")}
                  />
                </div>
              </div>
              {getFormikError(formik, "duration_value")}
              {getFormikError(formik, "duration_type")}
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

          <div className="flex justify-end gap-3">
            <ButtonGroup
              label={formik.isSubmitting ? "Updating..." : "Update Task"}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
