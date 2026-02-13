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
import type { AcademicGroupProps } from "../../../types/AcademicStructureType";
import { ButtonGroup } from "../../../ui/button/Button";
import { InputGroup, SelectGroup } from "../../../ui/form/FormComponents";

const labelClass = "block text-xs text-(--text-color) mb-1";

interface AcademicGroupOption {
  _id: string;
  academic_group: string;
}

export default function CreateTask() {
  const { allCategory, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
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
        const data = response.data;
        setAcademicGroups(
          data?.filter((item: AcademicGroupProps) => item?.status === "active"),
        );
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
      startLoadingBar();
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
        stopLoadingBar();
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
                className="w-full text-xs border border-(--border) bg-(--primary-bg) 
        text-(--text-color-emphasis) rounded-custom p-2 appearance-none 
        focus:ring-1 focus:ring-(--border) outline-none font-semibold"
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
                className="w-full text-xs border border-(--border) bg-(--primary-bg) 
        text-(--text-color-emphasis) rounded-custom p-2 appearance-none 
        focus:ring-1 focus:ring-(--border) outline-none font-semibold"
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

            <div>
              <label className={labelClass}>Task Type (Pillar)</label>
              <select
                name="task_type"
                value={formik.values.task_type}
                onChange={formik.handleChange}
                className="w-full text-xs border border-(--border) bg-(--primary-bg) 
        text-(--text-color-emphasis) rounded-custom p-2 appearance-none 
        focus:ring-1 focus:ring-(--border) outline-none font-semibold"
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

          <div className="flex justify-end gap-3">
            <ButtonGroup
              label={formik.isSubmitting ? "Creating..." : "Create Task"}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
