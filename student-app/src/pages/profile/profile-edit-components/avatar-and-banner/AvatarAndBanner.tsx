import type { UserProps } from "../../../../types/UserTypes";
import AvatarUpload from "./Avatar";
import BannerUpload from "./Banner";

interface ProfileImagesEditProps {
  user: UserProps | null;
}

export default function ProfileImagesEdit({ user }: ProfileImagesEditProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Profile Branding</h2>
        <p className="text-sm text-gray-500">Manage your public appearance.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AvatarUpload user={user} />
        <BannerUpload user={user} />
      </div>
    </div>
  );
}
