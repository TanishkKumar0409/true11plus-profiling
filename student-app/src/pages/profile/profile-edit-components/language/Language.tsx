import { useCallback, useEffect, useState, useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import { BiX, BiGlobe, BiPurchaseTag, BiPlus } from "react-icons/bi";
import {
    getErrorResponse,
    getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { customStyles } from "../../../../common/ExtraData";
import type { GlobalLanguage, UserLanguage } from "../../../../types/UserTypes";

export default function LanguageDetails() {
    const { authUser } = useOutletContext<DashboardOutletContextProps>();
    const [languages, setLanguages] = useState<UserLanguage[]>([]);
    const [allLanguages, setAllLanguages] = useState<GlobalLanguage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>(null);

    const getAllLanguages = useCallback(async () => {
        try {
            const response = await API.get(`/languages`);
            setAllLanguages(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        }
    }, []);

    useEffect(() => {
        getAllLanguages();
    }, [getAllLanguages]);

    const languageOptions = useMemo(() => {
        return allLanguages.map((lang) => ({
            value: lang._id,
            label: lang.language,
        }));
    }, [allLanguages]);

    const getLanguageById = useCallback(
        (id?: string) => {
            if (!id) return null;
            const lang = allLanguages.find((item) => item._id === id);
            return lang?.language;
        },
        [allLanguages]
    );

    const getLanguages = useCallback(async () => {
        if (!authUser?._id) return;
        try {
            const response = await API.get(`/user/language/${authUser._id}`);
            setLanguages(response.data);
        } catch (error) {
            getErrorResponse(error, true);
        }
    }, [authUser?._id]);

    useEffect(() => {
        getLanguages();
    }, [getLanguages]);

    const handleAddLanguage = async () => {
        if (!selectedOption) return;

        const langName = selectedOption.label;

        const isDuplicate = languages.some(l => {
            const resolvedName = getLanguageById(l.languageId) || l.language;
            return resolvedName?.toLowerCase() === langName.toLowerCase();
        });

        if (isDuplicate) {
            Swal.fire({
                icon: "warning",
                title: "Duplicate",
                text: "You have already added this language.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload = { language: langName };
            setLanguages(prev => [...prev, { language: langName }]);

            setSelectedOption(null);

            const response = await API.post("/user/add/language", payload);
            getSuccessResponse(response);
            await Promise.all([getLanguages(), getAllLanguages()]);
        } catch (error) {
            getErrorResponse(error);
            getLanguages();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                const result = await Swal.fire({
                    title: "Remove Language?",
                    text: "Are you sure you want to remove this language?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, remove it!",
                    iconColor: "#d33",
                    customClass: {
                        popup: "rounded-xl",
                    },
                });

                if (result.isConfirmed) {
                    setLanguages((prev) => prev.filter((l) => l._id !== id));
                    const response = await API.delete(`/user/delete/language/${id}`);
                    getSuccessResponse(response);
                }
            } catch (error) {
                getErrorResponse(error);
                getLanguages();
            }
        },
        [getLanguages]
    );

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Languages</h2>
                    <p className="text-sm text-gray-500">
                        Languages you speak and write.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mb-8 items-end">
                <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        Select or Type to Create
                    </label>
                    <CreatableSelect
                        options={languageOptions}
                        onChange={(newValue) => setSelectedOption(newValue)}
                        styles={customStyles}
                        placeholder="Select or type a language..."
                        isClearable
                        isDisabled={isLoading}
                        value={selectedOption}
                        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                    />
                </div>

                <button
                    onClick={handleAddLanguage}
                    disabled={!selectedOption || isLoading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 h-[38px] mb-[2px]"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <BiPlus size={20} />
                    )}
                    Add
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[120px]">
                {languages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-4">
                        <BiGlobe size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No languages added yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {languages.map((item) => (
                            <div
                                key={item._id || item.language}
                                className="group flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:border-purple-300 hover:shadow-md transition-all duration-200"
                            >
                                <BiPurchaseTag className="text-purple-500" size={14} />
                                <span>
                                    {getLanguageById(item?.languageId) || item?.language || "Loading..."}
                                </span>

                                <button
                                    onClick={() => handleDelete(item._id || "")}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none ml-1"
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