import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import {
  BiSave,
  BiMap,
  BiMapPin,
  BiBuilding,
  BiGlobe,
  BiNavigation,
  BiChevronDown,
} from "react-icons/bi";
import type {
  CityProps,
  DashboardOutletContextProps,
  StateProps,
} from "../../../../types/Types";
import useGetLocations from "../../../../hooks/useGetLocations";
import { userLocationEditValidation } from "../../../../contexts/ValidationSchema";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";

export default function AddressDetails() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);
  const { city, state, country } = useGetLocations();
  const [filteredStates, setFilteredStates] = useState<StateProps[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityProps[]>([]);

  // --- Formik Setup ---
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: authUser?._id || "",
      address: authUser?.address || "",
      pincode: authUser?.pincode || "",
      country: authUser?.country || "",
      state: authUser?.state || "",
      city: authUser?.city || "",
    },
    validationSchema: userLocationEditValidation,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await API.patch(`/user/update/location`, values);
        getSuccessResponse(response);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const filtred = state?.filter(
      (s) => s?.country_name === formik.values.country
    );
    setFilteredStates(filtred);
  }, [formik.values.country, state]);

  useEffect(() => {
    const filtred = city?.filter((s) => s?.state_name === formik.values.state);
    setFilteredCities(filtred);
  }, [formik.values.state, city]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      {/* Header */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Location Details</h2>
        <p className="text-sm text-gray-500">
          Manage your address and regional settings.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* --- Street Address (Full Width) --- */}
          <div className="md:col-span-2 space-y-1.5">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none text-gray-400 z-10">
                <BiMap size={18} />
              </div>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Ex. 123 Main St, Apartment 4B"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none`}
              />
            </div>
            {getFormikError(formik, "address")}
          </div>

          {/* --- Country Dropdown --- */}
          <div className="space-y-1.5">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiGlobe size={18} />
              </div>
              <select
                id="country"
                name="country"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none`}
              >
                <option value="">Select Country</option>
                {country?.map((c, index) => (
                  <option key={index} value={c?.country_name}>
                    {c?.country_name}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <BiChevronDown />
              </div>
            </div>
            {getFormikError(formik, "country")}
          </div>

          {/* --- State Dropdown --- */}
          <div className="space-y-1.5">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State / Province
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiNavigation size={18} />
              </div>
              <select
                id="state"
                name="state"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
                disabled={!formik.values.country}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none`}
              >
                <option value="">Select State</option>
                {filteredStates?.map((s, index) => (
                  <option key={index} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <BiChevronDown />
              </div>
            </div>
            {getFormikError(formik, "state")}
          </div>

          {/* --- City Dropdown --- */}
          <div className="space-y-1.5">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiBuilding size={18} />
              </div>
              <select
                id="city"
                name="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                disabled={!formik.values.state}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 appearance-none`}
              >
                <option value="">Select City</option>
                {filteredCities?.map((c, index) => (
                  <option key={index} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <BiChevronDown />
              </div>
            </div>
            {getFormikError(formik, "city")}
          </div>

          {/* --- Pincode --- */}
          <div className="space-y-1.5">
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700"
            >
              Pincode / Zip Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <BiMapPin size={18} />
              </div>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Ex. 248001"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pincode}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            {getFormikError(formik, "pincode")}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <BiSave size={18} />
            )}
            {isLoading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}
