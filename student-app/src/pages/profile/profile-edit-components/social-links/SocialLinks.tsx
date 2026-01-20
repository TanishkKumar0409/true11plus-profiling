import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiSave } from "react-icons/bi";
import {
    getErrorResponse,
    getFormikError,
    getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { SOCIAL_LINKS_DATA } from "../../../../common/SocialLinksData";

type PlatformKey = keyof typeof SOCIAL_LINKS_DATA;

export default function SocialLinks() {
    const { authUser } = useOutletContext<DashboardOutletContextProps>();
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
        }, {} as any)
    );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await API.post("/user/add/social-links", values);
                getSuccessResponse(response);
            } catch (error) {
                getErrorResponse(error);
            } finally {
                setIsLoading(false);
            }
        },
    });

    const getSocialLinks = useCallback(async () => {
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
        }
    }, [authUser?._id]);

    useEffect(() => {
        getSocialLinks();
    }, [getSocialLinks]);

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900">Social Profiles</h2>
                <p className="text-sm text-gray-500">
                    Connect with your audience. Leave fields empty to remove them.
                </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 gap-5">
                    {Object.entries(SOCIAL_LINKS_DATA).map(([key, config]) => {
                        const fieldName = key as PlatformKey;
                        return (
                            <div key={key} className="flex items-start gap-3">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border ${config.color} shrink-0 mt-[1px]`}
                                >
                                    {config.icon}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="relative">
                                        <input
                                            type="url"
                                            name={fieldName}
                                            placeholder={config.placeholder}
                                            value={formik.values[fieldName]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition-all ${formik.touched[fieldName] && formik.errors[fieldName]
                                                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                                                : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                                }`}
                                        />
                                    </div>
                                    {getFormikError(formik, fieldName)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-6 mt-2 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <BiSave size={18} />
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}