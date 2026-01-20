import { useCallback, useEffect, useState } from "react";
import { BiPlus, BiX, BiCodeAlt, BiPurchaseTag } from "react-icons/bi";
import {
    getErrorResponse,
    getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";

// --- Types ---
export interface UserSkill {
    _id?: string;
    skill: string;
}

export default function SkillsDetails() {
    const { authUser } = useOutletContext<DashboardOutletContextProps>();
    const [newSkill, setNewSkill] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [skills, setSkills] = useState<UserSkill[]>([]);

    const getSkills = useCallback(async () => {
        if (!authUser?._id) return;
        try {
            const response = await API.get(`/user/skills/${authUser._id}`);
            setSkills(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        }
    }, [authUser?._id]);

    useEffect(() => {
        getSkills();
    }, [getSkills]);

    const handleAddSkill = async () => {
        const trimmedSkill = newSkill.trim();
        if (!trimmedSkill) return;

        setIsAdding(true);
        try {
            const payload = { skill: trimmedSkill };
            setNewSkill("");
            const response = await API.post("/user/add/skill", payload);
            getSuccessResponse(response);
            getSkills();
        } catch (error) {
            getErrorResponse(error);
            getSkills();
        } finally {
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                const result = await Swal.fire({
                    title: "Remove Skill?",
                    text: "Are you sure you want to remove this skill?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, remove it!",
                    iconColor: "#d33",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });

                if (result.isConfirmed) {
                    setSkills((prev) => prev.filter((s) => s._id !== id));

                    const response = await API.delete(`/user/delete/skill/${id}`);
                    getSuccessResponse(response);
                    getSkills();
                }
            } catch (error) {
                getErrorResponse(error);
            }
        },
        [getSkills]
    );

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Skills</h2>
                    <p className="text-sm text-gray-500">
                        Highlight your abilities.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <BiCodeAlt size={20} />
                    </div>
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="E.g. React, Python, Project Management..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                    />
                </div>
                <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim() || isAdding}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                    {isAdding ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <BiPlus size={20} />
                    )}
                    Add
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[120px]">
                {skills.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-4">
                        <BiPurchaseTag size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No skills added yet. Start typing above!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {skills.map((item) => (
                            <div
                                key={item._id}
                                className="group flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:border-purple-300 hover:shadow-md transition-all duration-200"
                            >
                                <span>{item.skill}</span>
                                <button
                                    onClick={() => handleDelete(item._id || "")}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none"
                                    title="Remove"
                                >
                                    <BiX size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}