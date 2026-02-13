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
import {
  InputGroup,
  SelectGroup,
  TextareaGroup,
} from "../../ui/form/FormComponents";
import { ButtonGroup } from "../../ui/button/Button";
import UserEditSkeleton from "../../ui/loading/pages/UserEditSkeleton";

const inputClass =
  "w-full paragraph px-4 py-1.5 border border-(--border) rounded-custom focus:ring-1 focus:ring-(--border) focus:outline-none text-(--text-color-emphasis) bg-transparent font-semibold";
const labelClass = "block text-xs text-(--text-color) mb-1";

export default function UserEdit() {
  const { objectId } = useParams();
  const redirector = useNavigate();
  const { allStatus, roles, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, city, country } = useGetLocations();
  const [filteredStates, setFilteredStates] = useState<StateProps[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityProps[]>([]);

  const getUserDetails = useCallback(async () => {
    startLoadingBar();
    setLoading(true);
    try {
      const response = await API.get(`/user/${objectId}`);
      setUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
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
      startLoadingBar();
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
        stopLoadingBar();
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

  if (loading) return <UserEditSkeleton />;

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

      <div className="bg-(--primary-bg) rounded-custom shadow-custom">
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputGroup
                  label="Username"
                  id="username"
                  {...formik.getFieldProps("username")}
                  placeholder="Enter username"
                />
                {getFormikError(formik, "username")}
              </div>

              <div>
                <InputGroup
                  label="Full Name"
                  id="name"
                  {...formik.getFieldProps("name")}
                  placeholder="Enter name"
                />
                {getFormikError(formik, "name")}
              </div>

              <div>
                <InputGroup
                  label="Email Address"
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter email address"
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
                <TextareaGroup
                  {...formik.getFieldProps("address")}
                  id="address"
                  label="Address"
                />
                {getFormikError(formik, "address")}
              </div>

              <div>
                <InputGroup
                  label="Pincode"
                  type="text"
                  id="pincode"
                  {...formik.getFieldProps("pincode")}
                  placeholder="Enter pincode"
                />
                {getFormikError(formik, "pincode")}
              </div>

              <div>
                <SelectGroup
                  label="Country"
                  options={country?.map((item) => item?.country_name)}
                  id="country"
                  {...formik.getFieldProps("country")}
                />
                {getFormikError(formik, "country")}
              </div>

              {/* State Select */}
              <div>
                <SelectGroup
                  label="State"
                  options={filteredStates?.map((item) => item?.name)}
                  id="state"
                  {...formik.getFieldProps("state")}
                />
                {getFormikError(formik, "state")}
              </div>

              {/* City Select */}
              <div>
                <SelectGroup
                  label="City"
                  options={filteredCities?.map((item) => item?.name)}
                  id="city"
                  {...formik.getFieldProps("city")}
                />
                {getFormikError(formik, "city")}
              </div>
            </div>
          </div>

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
                <SelectGroup
                  label="Status"
                  options={getStatusAccodingToField(allStatus, "user")?.map(
                    (item) => item?.status_name,
                  )}
                  {...formik.getFieldProps("status")}
                  id="status"
                />
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

          <div className="flex justify-end pt-6 gap-3">
            <ButtonGroup
              label={formik.isSubmitting ? "Saving..." : "Save Changes"}
              type="submit"
              disable={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
