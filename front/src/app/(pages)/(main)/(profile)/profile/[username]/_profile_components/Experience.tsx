import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiBuilding, BiCalendar } from "react-icons/bi";

// Match the interface from your ExperienceDetails component
interface Experience {
    _id: string;
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    iscurrently: boolean;
    description: string;
}

export default function ExperienceInfo({ user }: { user: UserProps | null }) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getExperience = useCallback(async () => {
        if (!user?._id) return;
        try {
            const response = await API.get(`user/experience/${user._id}`);
            setExperiences(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        } finally {
            setIsLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        getExperience();
    }, [getExperience]);

    const groupedExperiences = useMemo(() => {
        const groups: Record<string, Experience[]> = {};
        experiences.forEach((exp) => {
            const companyKey = exp.company.trim();
            if (!groups[companyKey]) {
                groups[companyKey] = [];
            }
            groups[companyKey].push(exp);
        });
        return groups;
    }, [experiences]);

    // --- CONDITIONAL RENDERING ---
    if (!isLoading && experiences.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Experience</h3>
            </div>

            <div className="p-5 space-y-8">
                {Object.entries(groupedExperiences).map(([companyName, companyRoles]) => (
                    <div key={companyName}>
                        {/* Company Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <BiBuilding size={20} />
                            </div>
                            <h4 className="font-bold text-gray-800 text-lg">{companyName}</h4>
                        </div>

                        {/* List of Roles at this Company */}
                        <div className="space-y-6">
                            {companyRoles.map((exp) => (
                                <div key={exp._id} className="relative pl-6 border-l-2 border-purple-100 last:border-0 ml-4">
                                    {/* Timeline Dot */}
                                    <div className="absolute top-1.5 -left-[7px] w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white"></div>

                                    <div className="group">
                                        {/* Job Title */}
                                        <h5 className="text-base font-semibold text-gray-800 leading-tight">
                                            {exp.title}
                                        </h5>

                                        {/* Date Row */}
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 mb-2">
                                            <BiCalendar />
                                            <span>
                                                {(exp.start_date)} -{" "}
                                                {exp.iscurrently ? (
                                                    <span className="text-green-700 font-semibold bg-green-50 px-1.5 py-0.5 rounded">Present</span>
                                                ) : (
                                                    (exp.end_date)
                                                )}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {exp.description && (
                                            <p className="text-sm text-gray-600 leading-relaxed mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}