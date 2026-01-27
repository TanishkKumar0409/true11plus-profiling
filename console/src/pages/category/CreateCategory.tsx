import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API } from "../../contexts/API";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";
import type { DashboardOutletContextProps } from "../../types/Types";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useMemo, useRef } from "react";
import { getEditorConfig } from "../../common/JoditEditorConfig";
import { CategorySchema } from "../../contexts/ValidationSchema";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

export default function CreateCategory() {
  const navigate = useNavigate();

  const editor = useRef(null);
  const editorConfig = useMemo(() => getEditorConfig(), []);

  const { allCategory, getAllCategory } =
    useOutletContext<DashboardOutletContextProps>();

  const formik = useFormik({
    initialValues: {
      category_name: "",
      parent_category: "",
      description: "",
    },
    validationSchema: CategorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await API.post("/category/add", values);
        toast.success(response.data.message || "Category Created Successfully");

        if (getAllCategory) getAllCategory();

        navigate("/dashboard/category");
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const parentOptions = allCategory || [];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Create Category"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Category", path: "/dashboard/category" },
          { label: "Create Category" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label className={labelClass}>Category Name</label>
              <input
                type="text"
                name="category_name"
                value={formik.values.category_name}
                onChange={formik.handleChange}
                placeholder="e.g., Electronics, Furniture"
                className={inputClass}
              />
              {getFormikError(formik, "category_name")}
            </div>

            {/* Parent Category */}
            <div>
              <label className={labelClass}>Parent Category</label>
              <select
                name="parent_category"
                value={formik.values.parent_category}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="">-- No Parent (Root Category) --</option>
                {parentOptions.length > 0 ? (
                  parentOptions.map((cat: any, index: number) => (
                    <option key={index} value={cat._id}>
                      {cat.category_name}
                    </option>
                  ))
                ) : (
                  <option value="uncategorized">uncategorized</option>
                )}
              </select>
              {getFormikError(formik, "parent_category")}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <JoditEditor
              ref={editor}
              value={formik.values.description}
              config={editorConfig}
              onBlur={(content) => formik.setFieldValue("description", content)}
              onChange={(content) =>
                formik.setFieldValue("description", content)
              }
            />
            {getFormikError(formik, "description")}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {formik.isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
