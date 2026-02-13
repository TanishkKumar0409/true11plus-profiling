import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type KeyboardEvent,
} from "react";
import CreatableSelect from "react-select/creatable";
import { BiX, BiGlobe, BiPurchaseTag } from "react-icons/bi";
import {
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { customStyles } from "../../../../common/ExtraData";
import type { GlobalLanguage } from "../../../../types/UserTypes";
import { ButtonGroup } from "../../../../ui/buttons/Button";
import { AnimatePresence, motion } from "framer-motion";
import ProfileEditSkeleton from "../../../../ui/loading/pages/ProfileEditSkeleton";

// --- Types ---
export interface UserLanguageDoc {
  _id: string;
  userId: string;
  languageId: string[]; // Array of Object IDs
}

export default function LanguageDetails() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [userLangDoc, setUserLangDoc] = useState<UserLanguageDoc | null>(null);
  const [allLanguages, setAllLanguages] = useState<GlobalLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const getAllLanguages = useCallback(async () => {
    startLoadingBar();
    try {
      const response = await API.get(`/languages`);
      setAllLanguages(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      stopLoadingBar();
    }
  }, [startLoadingBar, stopLoadingBar]);

  const getLanguages = useCallback(async () => {
    startLoadingBar();
    setIsLoading(true);
    if (!authUser?._id) return;
    try {
      const response = await API.get(`/user/language/${authUser._id}`);
      setUserLangDoc(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
      stopLoadingBar();
    }
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getAllLanguages();
    getLanguages();
  }, [getAllLanguages, getLanguages]);

  const getLanguageNameById = useCallback(
    (id: string) => {
      const lang = allLanguages.find((item) => item._id === id);
      return lang?.language || "Unknown Language";
    },
    [allLanguages],
  );

  const languageOptions = useMemo(() => {
    const currentLangIds = userLangDoc?.languageId || [];
    return allLanguages
      .filter((lang) => !currentLangIds.includes(lang._id))
      .map((lang) => ({
        value: lang._id,
        label: lang.language,
      }));
  }, [allLanguages, userLangDoc]);

  const handleAddLanguage = async () => {
    if (!selectedOption) return;
    startLoadingBar();
    const langName = selectedOption.label;
    setIsLoading(true);

    try {
      const payload = { language: langName };
      const response = await API.post("/user/add/language", payload);
      getSuccessResponse(response);
      setSelectedOption(null);
      await Promise.all([getLanguages(), getAllLanguages()]);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsLoading(false);
      stopLoadingBar();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (selectedOption && !isLoading) {
        handleAddLanguage();
      }
    }
  };

  const handleDelete = useCallback(
    async (langId: string) => {
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
          startLoadingBar();
          setUserLangDoc((prev) =>
            prev
              ? {
                  ...prev,
                  languageId: prev.languageId.filter((id) => id !== langId),
                }
              : null,
          );

          const response = await API.delete(`/user/delete/language/${langId}`);
          getSuccessResponse(response);
          getLanguages();
        }
      } catch (error) {
        getErrorResponse(error);
        getLanguages();
      } finally {
        stopLoadingBar();
      }
    },
    [getLanguages, startLoadingBar, stopLoadingBar],
  );

  const currentLanguages = userLangDoc?.languageId || [];

  if (isLoading) return <ProfileEditSkeleton />;

  return (
    <div className="w-full bg-(--primary-bg) p-6 rounded-custom shadow-custom">
      <div className="mb-6 border-b border-(--border) pb-4">
        <p className="font-medium text-(--text-color)">
          Add the languages you can speak and write
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 items-end">
        <div className="flex-1 w-full" onKeyDown={handleKeyDown}>
          <label className="text-xs font-semibold text-(--text-color) mb-1 block">
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

        <ButtonGroup
          label="Add"
          onClick={handleAddLanguage}
          disable={!selectedOption || isLoading}
          className="h-11 px-8"
        />
      </div>

      <div className="rounded-custom">
        <AnimatePresence mode="wait">
          {currentLanguages.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center bg-(--secondary-bg) min-h-63 border-2 border-dashed border-(--border) p-8 text-center group transition-colors hover:border-(--main) rounded-custom"
            >
              <div className="bg-(--main-subtle) p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <BiGlobe size={40} className="text-(--main)" />
              </div>
              <h4>No languages added yet.</h4>
              <p className="mb-6">
                Start by selecting a language from the dropdown above.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-(--secondary-bg) p-6 min-h-38 rounded-custom shadow-custom"
            >
              <div className="flex flex-wrap gap-3 group">
                {currentLanguages.map((id) => (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-3 bg-(--white) pl-4 pr-2 py-2 text-sm font-medium transition-all rounded-custom capitalize"
                  >
                    <BiPurchaseTag className="text-(--main)" size={16} />
                    <span className="text-(--text-color)">
                      {getLanguageNameById(id)}
                    </span>
                    <button
                      onClick={() => handleDelete(id)}
                      className="ml-1 p-1 text-(--text-color) hover:text-(--danger) hover:bg-(--danger-subtle) rounded-full transition-colors"
                      title="Remove"
                      type="button"
                    >
                      <BiX size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
