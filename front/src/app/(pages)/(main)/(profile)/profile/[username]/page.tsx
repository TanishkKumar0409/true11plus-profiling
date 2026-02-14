"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { API } from "@/contexts/API";
import ContactInfo from "./_profile_components/ContactInfo";
import BasicInfo from "./_profile_components/BasicInfo";
import ExperienceInfo from "./_profile_components/Experience";
import EducationInfo from "./_profile_components/Education";
import RelatedUsers from "./_profile_components/RelatedUsers";
import PostSection from "./_profile_components/PostSection";
import LanguageInfo from "./_profile_components/LanguageInfo";
import SkillInfo from "./_profile_components/SkillInfo";
import { Button } from "@/ui/button/Button";
import ProfileSkeleton from "@/ui/loading/pages/ProfilePageSkeleton";

const ProfilePublic = () => {
  const { username } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserProps | null>(null);
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const fetchProfileData = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const [authRes, publicUserRes] = await Promise.allSettled([
        API.get(`/auth/user`),
        API.get(`/user/username/${username}`),
      ]);

      if (authRes.status === "fulfilled") {
        setAuthUser(authRes.value.data);
      }

      if (publicUserRes.status === "fulfilled") {
        setUser(publicUserRes.value.data);
        setIsUserNotFound(false);
      } else {
        setIsUserNotFound(true);
      }
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsPageLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (!isPageLoading && isUserNotFound) {
      router.push("/");
    }
  }, [isPageLoading, isUserNotFound, router]);

  if (isPageLoading) return <ProfileSkeleton />;

  if (!user && !isPageLoading) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24 pb-12 sm:px-8 px-4 bg-(--secondary-bg)">
      <div className="lg:col-span-1 space-y-6 mb-6">
        <BasicInfo user={user} />
        <ContactInfo user={user} />
        <EducationInfo user={user} />
        <ExperienceInfo user={user} />
        <LanguageInfo user={user} />
        <SkillInfo user={user} />
      </div>
      <div className="lg:col-span-2">
        <PostSection user={user} authUser={authUser} />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-25">
          {authUser?._id === user?._id && (
            <div className="flex items-center justify-between mb-4 bg-(--primary-bg) rounded-custom p-5 shadow-custom">
              <div>
                <h4 className="text-lg font-semibold text-(--text-color)">
                  Recent Activity
                </h4>
                <p className="text-xs text-(--text-subtle)">
                  Create New Post From Here.
                </p>
              </div>
              <Button
                label="Create Post"
                href={`${process.env.NEXT_PUBLIC_STUDENT_APP_URL}/profile`}
              />
            </div>
          )}

          <RelatedUsers user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePublic;
