import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { motion } from "framer-motion";
import useGetLocations from "../../../../hooks/useGetLocations";
import { userLocationEditValidation } from "../../../../contexts/ValidationSchema";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import {
  InputGroup,
  SelectGroup,
  TextareaGroup,
} from "../../../../ui/form/FormComponents";
import { ButtonGroup } from "../../../../ui/buttons/Button";

export default function AddressDetails() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);

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
      startLoadingBar();
      setIsLoading(true);
      try {
        const response = await API.patch(`/user/update/location`, values);
        getSuccessResponse(response);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
        stopLoadingBar();
      }
    },
  });

  const { city, state, country } = useGetLocations({
    selectedCountry: formik.values.country,
    selectedState: formik.values.state,
  });

  return (
    <motion.div className="w-full bg-(--primary-bg) rounded-custom shadow-custom p-6">
      <div className="mb-6 border-b border-(--border) pb-4">
        <p className="font-medium text-(--text-color)">
          Manage your regional settings and location.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <TextareaGroup
              label="Street Address"
              placeholder="Enter Your Street Address"
              id="address"
              {...formik.getFieldProps("address")}
            />
            {getFormikError(formik, "address")}
          </div>

          <div>
            <SelectGroup
              label="Country"
              id="country"
              options={country.map((c) => c.country_name)}
              placeholder="Select Country"
              {...formik.getFieldProps("country")}
            />
            {getFormikError(formik, "country")}
          </div>
          <div>
            <SelectGroup
              label="State / Province"
              id="state"
              options={state.map((c) => c.name)}
              placeholder="Select State"
              {...formik.getFieldProps("state")}
            />
            {getFormikError(formik, "state")}
          </div>

          <div>
            <SelectGroup
              label="City"
              id="city"
              options={city.map((c) => c.name)}
              placeholder="Select City"
              {...formik.getFieldProps("city")}
            />
            {getFormikError(formik, "city")}
          </div>

          <div>
            <InputGroup
              label="Pincode"
              type="text"
              id="pincode"
              placeholder="Enter Pincode"
              {...formik.getFieldProps("pincode")}
            />
            {getFormikError(formik, "pincode")}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <ButtonGroup
            type="submit"
            disable={isLoading || !formik.isValid || !formik.dirty}
            label={isLoading ? "Saving..." : "Save Changes"}
          />
        </div>
      </form>
    </motion.div>
  );
}
