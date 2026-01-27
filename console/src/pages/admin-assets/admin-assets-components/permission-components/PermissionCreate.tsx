import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { API } from "../../../../contexts/API";
import {
  getErrorResponse,
  getFormikError,
} from "../../../../contexts/Callbacks";
import { SimpleTable } from "../../../../ui/table/SimpleTable";
import toast from "react-hot-toast";
import type { Column } from "../../../../types/Types";
import { BiPlus, BiTrash, BiSave, BiX } from "react-icons/bi";
import { reactSelectDesignClass } from "../../../../common/ExtraData";

type RoleIdType = string | { _id: string };

export default function PermissionCreate({
  setIsAdding,
  roles,
  isAdding,
  getAllPermissions,
}: {
  setIsAdding: any;
  roles: any;
  isAdding: any;
  getAllPermissions: () => void;
}) {
  const [permissions, setPermissions] = useState<
    { title: string; description?: string }[]
  >([]);
  const [permTitle, setPermTitle] = useState("");
  const [permDesc, setPermDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill permissions when editing
  useEffect(() => {
    if (isAdding && isAdding.permissions) {
      setPermissions(isAdding.permissions);
    } else {
      setPermissions([]);
    }
  }, [isAdding]);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      title: isAdding?.title || "",
      roles: isAdding?.roles
        ? roles
            .filter((r: any) =>
              isAdding.roles.some((roleId: RoleIdType) => {
                if (typeof roleId === "string") {
                  return roleId === r.value;
                }
                if (
                  typeof roleId === "object" &&
                  roleId !== null &&
                  "_id" in roleId
                ) {
                  return roleId._id === r.value;
                }
                return false;
              }),
            )
            .map((r: any) => ({
              value: r.value,
              label: r.label,
            }))
        : [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Module title is required"),
      roles: Yup.array()
        .min(1, "Select at least one role")
        .of(
          Yup.object({
            value: Yup.string().required(),
            label: Yup.string().required(),
          }),
        ),
    }),
    onSubmit: async (values) => {
      if (permissions.length === 0) {
        toast.error("Add at least one permission before saving.");
        return;
      }
      try {
        setLoading(true);
        const roleIds = values.roles.map((r: any) => r.value);

        const response = await API.post("/create/permissions", {
          title: values.title,
          roles: roleIds,
          permissions,
        });

        toast.success(
          response.data.message || "Permission set created successfully",
        );
        formik.resetForm();
        setPermissions([]);
        setIsAdding(false);
        getAllPermissions();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Add Permission
  const handleAddPermission = () => {
    if (!permTitle.trim()) return toast.error("Enter permission title");

    setPermissions((prev) => [
      ...prev,
      { title: permTitle.trim(), description: permDesc.trim() },
    ]);
    setPermTitle("");
    setPermDesc("");
  };

  // ✅ Remove Permission
  const handleRemovePermission = (title: string) => {
    setPermissions((prev) => prev.filter((perm) => perm.title !== title));
  };

  // ✅ Table columns
  const columns: Column<{ title: string; description?: string }>[] = [
    {
      label: "Permission Title",
      value: (row) => (
        <span className="font-medium text-gray-700">{row.title}</span>
      ),
    },
    {
      label: "Description",
      value: (row) => (
        <span className="text-gray-500">{row.description || "-"}</span>
      ),
    },
    {
      label: "Action",
      value: (row) => (
        <button
          type="button"
          onClick={() => handleRemovePermission(row.title)}
          className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          title="Remove Permission"
        >
          <BiTrash size={18} />
        </button>
      ),
    },
  ];

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm";

  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isAdding?._id ? "Edit Permission Set" : "Create Permission Set"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Define module access and specific actions.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(false)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <BiX size={24} />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* --- Main Info Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module Title */}
          <div>
            <label className={labelClass}>Module Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Property Management"
              className={inputClass}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFormikError(formik, "title")}
          </div>

          {/* Roles */}
          <div>
            <label className={labelClass}>Applicable Roles</label>
            <Select
              isMulti
              options={roles}
              value={formik.values.roles}
              onChange={(selected) => formik.setFieldValue("roles", selected)}
              onBlur={() => formik.setFieldTouched("roles", true)}
              classNames={reactSelectDesignClass}
              placeholder="Select roles..."
            />
            {getFormikError(formik, "roles")}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            Add Specific Permission
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Permission Title (e.g., Create Property)"
                value={permTitle}
                onChange={(e) => setPermTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-6">
              <input
                type="text"
                placeholder="Description (Optional)"
                value={permDesc}
                onChange={(e) => setPermDesc(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleAddPermission}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BiPlus size={18} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* --- Permissions Table --- */}
        {permissions.length > 0 ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <SimpleTable data={permissions} columns={columns} />
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm">No permissions added yet.</p>
          </div>
        )}

        {/* --- Footer Actions --- */}
        <div className="flex justify-end pt-4 gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <BiSave size={18} />
                {isAdding?._id ? "Update Permissions" : "Save Permissions"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
