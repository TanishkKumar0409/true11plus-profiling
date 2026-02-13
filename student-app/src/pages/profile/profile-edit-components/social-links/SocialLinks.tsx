import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getErrorResponse,
  getFormikError,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { SOCIAL_LINKS_DATA } from "../../../../common/SocialLinksData";
import { motion } from "framer-motion";
import { InputGroup } from "../../../../ui/form/FormComponents";
import { ButtonGroup } from "../../../../ui/buttons/Button";
import ProfileEditSkeleton from "../../../../ui/loading/pages/ProfileEditSkeleton";

type PlatformKey = keyof typeof SOCIAL_LINKS_DATA;

export default function SocialLinks() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: Record<PlatformKey, string> = {
    facebook: "",
    linkedin: "",
    instagram: "",
    twitterx: "",
    youtube: "",
    reddit: "",
    discord: "",
  };

  const validationSchema = Yup.object().shape(
    Object.keys(SOCIAL_LINKS_DATA).reduce((acc, key) => {
      acc[key] = Yup.string().url("Invalid URL format").nullable();
      return acc;
    }, {} as any),
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      startLoadingBar();
      setIsLoading(true);
      try {
        const response = await API.post("/user/add/social-links", values);
        getSuccessResponse(response);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setIsLoading(false);
        stopLoadingBar();
      }
    },
  });

  const getSocialLinks = useCallback(async () => {
    startLoadingBar();
    setIsLoading(true);
    if (!authUser?._id) return;
    try {
      const response = await API.get(`user/social-links/${authUser._id}`);
      const data = response.data;
      const newValues = { ...initialValues };

      Object.keys(data).forEach((key) => {
        if (key in newValues) {
          newValues[key as PlatformKey] = data[key];
        }
      });

      formik.setValues(newValues);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
      stopLoadingBar();
    }
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getSocialLinks();
  }, [getSocialLinks]);

  if (isLoading) return <ProfileEditSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-(--primary-bg) rounded-custom shadow-custom p-6"
    >
      <div className="mb-8 border-b border-(--border) pb-4">
        <p className="font-medium text-(--text-color)">
          Connect your digital presence to your professional profile.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(SOCIAL_LINKS_DATA).map(([key, config]) => {
            const fieldName = key as PlatformKey;
            return (
              <div key={key} className="flex items-start gap-4 group">
                <div
                  className={`w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0 rounded-custom shadow-custom ${config.color}`}
                >
                  {config.icon}
                </div>
                <div className="flex-1">
                  <InputGroup
                    label={config.label}
                    type="url"
                    id={fieldName}
                    placeholder={config.placeholder}
                    {...formik.getFieldProps(fieldName)}
                  />
                  {getFormikError(formik, fieldName)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}

        <div className="flex justify-end pt-6">
          <ButtonGroup
            label={isLoading ? "Updating..." : "Save Social Links"}
            type="submit"
            disable={isLoading || !formik.dirty || !formik.isValid}
          />
        </div>
      </form>
    </motion.div>
  );
}
