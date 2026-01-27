import { useCallback, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import { API } from "../../contexts/API";
import type {
  CityProps,
  StateProps,
  DashboardOutletContextProps,
} from "../../types/Types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  getErrorResponse,
  getFormikError,
  getStatusAccodingToField,
} from "../../contexts/Callbacks";
import toast from "react-hot-toast";
import type { UserProps } from "../../types/UserProps";
import { ToggleSwitch } from "../../ui/button/ToggleSwitch";
import useGetLocations from "../../hooks/useGetLocations";
import { phoneInputStyle } from "../../common/ExtraData";
import { userUpdateValidation } from "../../contexts/ValidationSchema";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

export default function UserEdit() {
  const { objectId } = useParams();
  const redirector = useNavigate();
  const { allStatus, roles } = useOutletContext<DashboardOutletContextProps>();

  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, city, country } = useGetLocations();
  const [filteredStates, setFilteredStates] = useState<StateProps[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityProps[]>([]);

  const getUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/user/${objectId}`);
      setUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  // --- Formik ---
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user?.username || "",
      name: user?.name || "",
      email: user?.email || "",
      mobile_no: user?.mobile_no || "",
      pincode: user?.pincode || "",
      address: user?.address || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      role: user?.role || "",
      status: user?.status || "",
      verified: user?.verified || false,
    },
    validationSchema: userUpdateValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload = { ...values };
        const locationPayload = {
          address: values?.address,
          pincode: values?.pincode,
          city: values?.city,
          state: values?.state,
          country: values?.country,
        };

        const [response, locationResponse] = await Promise.all([
          API.patch(`/user/admin/update/${objectId}`, payload),
          API.patch(`/user/location/update/${objectId}`, locationPayload),
        ]);

        toast.success(response.data.message || "User updated successfully");
        toast.success(locationResponse.data.message || "Location updated");
        redirector(`/dashboard/user/${objectId}`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const filtered = state?.filter(
      (s) => s?.country_name === formik.values.country,
    );
    setFilteredStates(filtered);
  }, [formik.values.country, state]);

  useEffect(() => {
    const filtered = city?.filter((s) => s?.state_name === formik.values.state);
    setFilteredCities(filtered);
  }, [formik.values.state, city]);

  const handleVerifiedToggle = () => {
    formik.setFieldValue("verified", !formik.values.verified);
  };

  if (loading) return <>User Edit Loading...</>;

  return (
    <div className="space-y-6 mx-auto pb-10">
      <Breadcrumbs
        title="User Profile"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/dashboard/users" },
          {
            label: user?.username || "Profile",
            path: `/dashboard/user/${user?._id}`,
          },
          { label: "edit" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          {/* --- Section 1: Personal Info --- */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  {...formik.getFieldProps("username")}
                  placeholder="Enter username"
                  className={inputClass}
                />
                {getFormikError(formik, "username")}
              </div>

              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  {...formik.getFieldProps("name")}
                  placeholder="Enter full name"
                  className={inputClass}
                />
                {getFormikError(formik, "name")}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter email address"
                  className={inputClass}
                />
                {getFormikError(formik, "email")}
              </div>

              {/* Mobile */}
              <div>
                <label className={labelClass}>Mobile Number</label>
                <PhoneInput
                  country="in"
                  value={String(formik.values.mobile_no || "")}
                  onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
                  containerClass={phoneInputStyle.container}
                  inputClass={phoneInputStyle.input}
                  buttonClass={phoneInputStyle.button}
                  dropdownClass={phoneInputStyle.dropdown}
                />
                {getFormikError(formik, "mobile_no")}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  {...formik.getFieldProps("address")}
                  placeholder="Enter full address"
                  className={inputClass}
                />
                {getFormikError(formik, "address")}
              </div>

              {/* Pincode */}
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  {...formik.getFieldProps("pincode")}
                  placeholder="Enter pincode"
                  className={inputClass}
                />
                {getFormikError(formik, "pincode")}
              </div>

              {/* Country Select */}
              <div>
                <label className={labelClass}>Country</label>
                <select
                  {...formik.getFieldProps("country")}
                  className={inputClass}
                >
                  <option value="">Select Country</option>
                  {country?.map((c, i) => (
                    <option key={i} value={c?.country_name}>
                      {c?.country_name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "country")}
              </div>

              {/* State Select */}
              <div>
                <label className={labelClass}>State</label>
                <select
                  {...formik.getFieldProps("state")}
                  className={inputClass}
                  disabled={!formik.values.country}
                >
                  <option value="">Select State</option>
                  {filteredStates?.map((s, i) => (
                    <option key={i} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "state")}
              </div>

              {/* City Select */}
              <div>
                <label className={labelClass}>City</label>
                <select
                  {...formik.getFieldProps("city")}
                  className={inputClass}
                  disabled={!formik.values.state}
                >
                  <option value="">Select City</option>
                  {filteredCities?.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "city")}
              </div>
            </div>
          </div>

          {/* --- Section 3: Account Settings --- */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Select */}
              <div>
                <label className={labelClass}>Role</label>
                <select
                  {...formik.getFieldProps("role")}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Assign Role
                  </option>
                  {roles
                    ?.filter((item) => item?.role !== "bot admin")
                    ?.map((item, i) => (
                      <option key={i} value={item?._id}>
                        {item?.role}
                      </option>
                    ))}
                </select>
                {getFormikError(formik, "role")}
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  {...formik.getFieldProps("status")}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Set Status
                  </option>
                  {getStatusAccodingToField(allStatus, "user").map((s, i) => (
                    <option key={i} value={s.status_name}>
                      {s.status_name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "status")}
              </div>

              <ToggleSwitch
                label="Verified User"
                description="Enable this to mark the user as verified manually."
                checked={formik.values.verified}
                onChange={handleVerifiedToggle}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={() => redirector(-1)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
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
