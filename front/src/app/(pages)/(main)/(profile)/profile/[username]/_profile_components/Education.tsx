import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiCalendar, BiBuilding } from "react-icons/bi";

interface UserEducation {
    _id: string;
    student_class: string;
    school: string;
    academic_year: string;
    description: string;
    pursuing: boolean;
}

export default function EducationInfo({ user }: { user: UserProps | null }) {
    const [educations, setEducations] = useState<UserEducation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getEducation = useCallback(async () => {
        if (!user?._id) return;
        try {
            const response = await API.get(`user/education/${user._id}`);
            setEducations(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        } finally {
            setIsLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        getEducation();
    }, [getEducation]);

    // --- Grouping Logic: Group by School ---
    const groupedEducations = useMemo(() => {
        const groups: Record<string, UserEducation[]> = {};
        educations.forEach((edu) => {
            const schoolKey = edu.school.trim();
            if (!groups[schoolKey]) {
                groups[schoolKey] = [];
            }
            groups[schoolKey].push(edu);
        });
        return groups;
    }, [educations]);

    // --- CONDITIONAL RENDERING ---
    if (!isLoading && educations.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Education</h3>
            </div>

            <div className="p-5 space-y-8">
                {Object.entries(groupedEducations).map(([schoolName, schoolClasses]) => (
                    <div key={schoolName}>
                        {/* School Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <BiBuilding size={20} />
                            </div>
                            <h4 className="font-bold text-gray-800 text-lg">{schoolName}</h4>
                        </div>

                        {/* List of Classes at this School */}
                        <div className="space-y-6">
                            {schoolClasses.map((edu) => (
                                <div
                                    key={edu._id}
                                    className="relative pl-6 border-l-2 border-purple-100 last:border-0 ml-4"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute top-1.5 -left-[7px] w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white"></div>

                                    <div className="group">
                                        {/* Class Name */}
                                        <h5 className="text-base font-semibold text-gray-800 leading-tight">
                                            {edu.student_class}
                                        </h5>

                                        {/* Academic Year Badge */}
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 mb-2">
                                            <span
                                                className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium ${edu.pursuing
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {edu.pursuing ? (
                                                    "Pursuing"
                                                ) : (
                                                    <>
                                                        <BiCalendar size={11} /> {edu.academic_year}
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {edu.description && (
                                            <p className="text-sm text-gray-600 leading-relaxed mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                {edu.description}
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