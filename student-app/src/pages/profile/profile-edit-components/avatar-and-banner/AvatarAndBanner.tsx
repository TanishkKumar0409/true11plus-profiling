import type { UserProps } from "../../../../types/UserTypes";
import AvatarUpload from "./Avatar";
import BannerUpload from "./Banner";

interface ProfileImagesEditProps {
  user: UserProps | null;
}

export default function ProfileImagesEdit({ user }: ProfileImagesEditProps) {
  return (
    <div className="w-full">
      <div className="bg-(--primary-bg) overflow-hidden shadow-custom rounded-custom">
        <BannerUpload user={user} />
        <div className="px-6 md:px-10 pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
            <div className="relative z-10 mt-8">
              <AvatarUpload user={user} />
            </div>
            <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 w-full pb-2">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-(--text-color)">
                  {user?.name}
                </h3>
                {user?.title && (
                  <p className="text-sm text-(--text-subtle)">{user?.title}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
