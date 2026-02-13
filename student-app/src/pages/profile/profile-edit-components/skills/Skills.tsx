import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type KeyboardEvent,
} from "react";
import CreatableSelect from "react-select/creatable";
import { BiX, BiStar, BiHash } from "react-icons/bi";
import {
  getErrorResponse,
  getSuccessResponse,
} from "../../../../contexts/CallBacks";
import { API } from "../../../../contexts/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import Swal from "sweetalert2";
import { customStyles } from "../../../../common/ExtraData";
import { ButtonGroup } from "../../../../ui/buttons/Button";
import { AnimatePresence, motion } from "framer-motion";
import ProfileEditSkeleton from "../../../../ui/loading/pages/ProfileEditSkeleton";

// --- Types ---
export interface UserSkillDoc {
  _id: string;
  userId: string;
  skill: string[];
}

export interface GlobalSkill {
  _id: string;
  skill: string;
}

export default function SkillsDetails() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [userSkillDoc, setUserSkillDoc] = useState<UserSkillDoc | null>(null);
  const [allSkills, setAllSkills] = useState<GlobalSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const getAllSkills = useCallback(async () => {
    startLoadingBar();
    try {
      const response = await API.get(`/skills`);
      setAllSkills(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      stopLoadingBar();
    }
  }, [startLoadingBar, stopLoadingBar]);

  const getSkills = useCallback(async () => {
    startLoadingBar();
    setIsLoading(true);
    if (!authUser?._id) return;
    try {
      const response = await API.get(`/user/skills/${authUser._id}`);
      setUserSkillDoc(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
      stopLoadingBar();
    }
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getAllSkills();
    getSkills();
  }, [getAllSkills, getSkills]);

  const getSkillNameById = useCallback(
    (id: string) => {
      return allSkills.find((s) => s._id === id)?.skill || "New Interest";
    },
    [allSkills],
  );

  const skillOptions = useMemo(() => {
    const currentSkills = userSkillDoc?.skill || [];
    return allSkills
      .filter((s) => !currentSkills.includes(s._id))
      .map((s) => ({
        value: s._id,
        label: s.skill,
      }));
  }, [allSkills, userSkillDoc]);

  const handleAddSkill = async () => {
    if (!selectedOption) return;
    startLoadingBar();
    const skillName = selectedOption.label.trim();
    setIsLoading(true);

    try {
      const payload = { skill: skillName };
      const response = await API.post("/user/add/skill", payload);
      getSuccessResponse(response);
      setSelectedOption(null);
      await Promise.all([getSkills(), getAllSkills()]);
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
        handleAddSkill();
      }
    }
  };

  const handleDelete = useCallback(
    async (skill: string) => {
      try {
        const result = await Swal.fire({
          title: "Remove this interest?",
          text: "Are you sure you want to remove this from your list?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, remove it",
          iconColor: "#8B5CF6",
          customClass: { popup: "rounded-xl" },
        });

        if (result.isConfirmed) {
          startLoadingBar();
          setUserSkillDoc((prev) =>
            prev
              ? { ...prev, skill: prev.skill.filter((id) => id !== skill) }
              : null,
          );

          const response = await API.delete(`/user/delete/skill/${skill}`);
          getSuccessResponse(response);
          getSkills();
        }
      } catch (error) {
        getErrorResponse(error);
        getSkills();
      } finally {
        stopLoadingBar();
      }
    },
    [getSkills, startLoadingBar, stopLoadingBar],
  );

  const skillList = userSkillDoc?.skill || [];

  if (isLoading) return <ProfileEditSkeleton />;

  return (
    <div className="w-full bg-(--primary-bg) p-6 rounded-custom shadow-custom mt-6">
      <div className="mb-6 border-b border-(--border) pb-4">
        <p className="font-medium text-(--text-color)">
          Tell us what you love to do! (e.g. Football, Chess, Painting)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 items-end">
        <div className="flex-1 w-full" onKeyDown={handleKeyDown}>
          <label className="text-xs font-semibold text-(--text-color) mb-1 block">
            Search or Type to Create
          </label>
          <CreatableSelect
            options={skillOptions}
            onChange={(newValue) => setSelectedOption(newValue)}
            styles={customStyles}
            placeholder="What are you interested in?..."
            isClearable
            isDisabled={isLoading}
            value={selectedOption}
            formatCreateLabel={(inputValue) =>
              `Add "${inputValue}" as an interest`
            }
          />
        </div>

        <ButtonGroup
          label="Add"
          onClick={handleAddSkill}
          disable={!selectedOption || isLoading}
          className="h-11 px-8"
        />
      </div>

      <div className="rounded-custom">
        <AnimatePresence mode="wait">
          {skillList.length === 0 ? (
            <motion.div
              key="empty-skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center bg-(--secondary-bg) min-h-63 border-2 border-dashed border-(--border) p-8 text-center group transition-colors hover:border-(--main) rounded-custom"
            >
              <div className="bg-(--main-subtle) p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <BiStar size={40} className="text-(--main)" />
              </div>
              <h4 className="text-lg font-semibold">Your list is empty!</h4>
              <p className="mb-6">
                Start adding things you like to do after school.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="skills-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-(--secondary-bg) p-6 min-h-38 rounded-custom shadow-custom"
            >
              <div className="flex flex-wrap gap-3">
                {skillList.map((id) => (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-3 bg-(--white) pl-4 pr-2 py-2 text-sm font-medium transition-all rounded-custom capitalize"
                  >
                    <BiHash className="text-(--main)" size={16} />
                    <span className="text-(--text-color)">
                      {getSkillNameById(id)}
                    </span>
                    <button
                      onClick={() => handleDelete(id)}
                      className="ml-1 p-1 text-(--text-color) hover:text-(--danger) hover:bg-(--danger-subtle) rounded-full transition-colors"
                      title="Remove"
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
