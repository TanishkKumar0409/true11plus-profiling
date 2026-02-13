import { useOutletContext } from "react-router-dom";
import { ButtonGroup, SecondButton } from "../../../../ui/buttons/Button";
import type { DashboardOutletContextProps } from "../../../../types/Types";
import { getUserAvatar } from "../../../../contexts/CallBacks";

export const ProfileHeader = () => {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const bannerUrl = authUser?.banner?.[0]
    ? `${import.meta.env.VITE_MEDIA_URL}/${authUser.banner[0]}`
    : null;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom border border-(--gray-subtle)">
      <div className="h-32 sm:h-64 bg-(--main) relative overflow-hidden">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4 flex justify-between items-end">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-(--primary-bg) bg-(--primary-bg) overflow-hidden shadow-custom">
              <img
                src={getUserAvatar(authUser?.avatar || [])}
                alt={authUser?.username || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="hidden sm:flex gap-3 mb-2">
            <ButtonGroup
              target="_blank"
              href={`${import.meta.env.VITE_FRONT_URL}/profile/${authUser?.username}`}
              label="View Public Profile"
            />
            <SecondButton href="/profile/edit" label="Edit Profile" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-(--gray-emphasis)">
                {authUser?.name || "Aspiring Scholar"}
              </h1>
            </div>
            <p className="font-semibold text-(--main-emphasis) text-sm leading-none italic">
              {authUser?.title || "University Candidate"}
            </p>
            <p className="text-(--gray) text-sm font-medium">
              @{authUser?.username}
            </p>
          </div>

          <div className="flex gap-8 sm:text-right">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-(--gray-emphasis)">
                600+
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-(--gray)">
                Followers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-(--purple-emphasis)">
                85%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-(--gray)">
                Readiness
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
