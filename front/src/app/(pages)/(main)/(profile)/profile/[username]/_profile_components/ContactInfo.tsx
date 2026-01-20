
import { SOCIAL_CONFIG } from "@/common/SocialIconData";
import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import React, { useCallback, useEffect, useState } from "react";
import {
    BiGlobe,
    BiEnvelope,
    BiPhone,
} from "react-icons/bi";

export default function ContactInfo({ user }: { user: UserProps | null }) {
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

    const getSocialLinks = useCallback(async () => {
        if (!user?._id) return;
        try {
            const response = await API.get(`user/social-links/${user._id}`);
            setSocialLinks(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        }
    }, [user?._id]);

    useEffect(() => {
        getSocialLinks();
    }, [getSocialLinks]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
            </div>

            <div className="p-5 space-y-5">
                <div className="space-y-4">
                    {user?.email && (
                        <div className="flex items-start gap-3 group">
                            <div className="mt-0.5 p-1.5 bg-purple-50 text-purple-600 rounded-md">
                                <BiEnvelope size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email Address</p>
                                <a
                                    href={`mailto:${user.email}`}
                                    className="text-sm text-gray-700 hover:text-purple-600 truncate block transition-colors"
                                    title={user.email}
                                >
                                    {user.email}
                                </a>
                            </div>
                        </div>
                    )}

                    {user?.mobile_no && (
                        <div className="flex items-start gap-3 group">
                            <div className="mt-0.5 p-1.5 bg-green-50 text-green-600 rounded-md">
                                <BiPhone size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mobile Number</p>
                                <a
                                    href={`tel:${user.mobile_no}`}
                                    className="text-sm text-gray-700 hover:text-green-600 transition-colors"
                                >
                                    {user.mobile_no}
                                </a>
                            </div>
                        </div>
                    )}

                    {user?.website && (
                        <div className="flex items-start gap-3 group">
                            <div className="mt-0.5 p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                <BiGlobe size={18} />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Website</p>
                                <a
                                    href={(user.website)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-gray-700 hover:text-blue-600 truncate block transition-colors"
                                >
                                    {user.website}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {Object.keys(socialLinks).length > 0 && (
                    <>
                        <div className="h-px bg-gray-100" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">
                                Social Profiles
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(socialLinks).map(([key, url]) => {
                                    if (!url) return null;
                                    const config = SOCIAL_CONFIG[key.toLowerCase()];

                                    if (!config) return null;

                                    return (
                                        <a
                                            key={key}
                                            href={(url)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`p-2.5 rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 ${config.color} hover:border-transparent hover:shadow-sm`}
                                            title={config.label}
                                        >
                                            {config.icon}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}