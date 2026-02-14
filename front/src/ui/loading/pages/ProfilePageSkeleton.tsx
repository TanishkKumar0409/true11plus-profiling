"use client";

import BasicInfoSkeleton from "../components/profile/BasicInfoSkeleton";
import ConnectionSkeleton from "../components/profile/ConnectionSkeleton";
import ContactInfoSkeleton from "../components/profile/ContactInfoSkeleton";
import EducationInfoSkeleton from "../components/profile/EducationInfoSkeleton";
import ExperienceInfoSkeleton from "../components/profile/ExperienceInfoSkeleton";
import LanguageInfoSkeleton from "../components/profile/LanguageInfoSkeleton";
import PostCardSkeleton from "../components/profile/PostCardSkeleton";

const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24 pb-12 sm:px-8 px-4 bg-(--secondary-bg)">
      <div className="lg:col-span-1 space-y-6 mb-6">
        <BasicInfoSkeleton />
        <ContactInfoSkeleton />
        <EducationInfoSkeleton />
        <ExperienceInfoSkeleton />
        <LanguageInfoSkeleton />
      </div>

      {/* CENTER CONTENT */}
      <div className="lg:col-span-2 space-y-6">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-25">
          <ConnectionSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
