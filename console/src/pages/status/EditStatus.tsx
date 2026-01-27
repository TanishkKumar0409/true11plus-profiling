import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { API } from "../../contexts/API";
import { getErrorResponse, getFormikError } from "../../contexts/Callbacks";
import type {
  DashboardOutletContextProps,
  StatusProps,
} from "../../types/Types";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { statusValidation } from "../../contexts/ValidationSchema";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

export default function EditStatus() {
  const { objectId } = useParams();
  const redirector = useNavigate();
  const { allStatus, getAllStatus } =
    useOutletContext<DashboardOutletContextProps>();

  const [statusData, setStatusData] = useState<StatusProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allStatus?.length > 0) {
      const found = allStatus.find((item) => item._id === objectId);
      if (found) {
        setStatusData(found);
        setLoading(false);
      }
    } else {
      setStatusData(null);
    }
  }, [objectId, allStatus]);

  const parentOptions =
    allStatus?.filter(
      (item: StatusProps) =>
        item._id !== objectId &&
        !["Active", "Pending", "Suspended"].includes(item.status_name),
    ) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status_name: statusData?.status_name || "",
      parent_status: statusData?.parent_status || "",
      description: statusData?.description || "",
    },
    validationSchema: statusValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await API.patch(`/status/update/${objectId}`, values);

        toast.success(response.data.message || "Status Updated Successfully");
        getAllStatus();
        redirector(`/dashboard/status`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Edit Status"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Status", path: "/dashboard/status" },
          {
            label: statusData?.status_name || "Detail",
            path: `/dashboard/status/${objectId}`,
          },
          { label: "Edit" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Status Name</label>
              <input
                type="text"
                name="status_name"
                value={formik.values.status_name}
                onChange={formik.handleChange}
                placeholder="e.g., Shipped, Banned"
                className={inputClass}
              />
              {getFormikError(formik, "status_name")}
            </div>

            <div>
              <label className={labelClass}>Parent Category</label>
              <select
                name="parent_status"
                value={formik.values.parent_status}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="">-- No Parent (Root Status) --</option>
                <option value="uncategorized">Uncategorized</option>
                {parentOptions.map((status, index) => (
                  <option key={index} value={status.status_name}>
                    {status.status_name}
                  </option>
                ))}
              </select>
              {getFormikError(formik, "parent_status")}
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Describe what this status represents..."
              rows={4}
              className={inputClass}
            />
            {getFormikError(formik, "description")}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {formik.isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
