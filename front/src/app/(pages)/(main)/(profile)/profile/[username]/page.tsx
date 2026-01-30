"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { API } from "@/contexts/API";
import ContactInfo from "./_profile_components/ContactInfo";
import BasicInfo from "./_profile_components/BasicInfo";
import ExperienceInfo from "./_profile_components/Experience";
import EducationInfo from "./_profile_components/Education";
import RelatedUsers from "./_profile_components/RelatedUsers";
import PostSection from "./_profile_components/PostSection";

const ProfilePublic = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<UserProps | null>(null);

  const getAuthUserUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/auth/user`);
      setAuthUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAuthUserUser();
  }, [getAuthUserUser]);

  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/user/username/${username}`);
      setUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        <Link href="/" className="text-blue-600 mt-4 hover:underline">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <BasicInfo user={user} />
            <ContactInfo user={user} />
            <ExperienceInfo user={user} />
            <EducationInfo user={user} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PostSection user={user} authUser={authUser} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            {authUser?._id === user?._id && (
              <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h4>
                  <p className="text-xs text-gray-500">2 new posts this week</p>
                </div>
                <Link
                  href={`${process.env.NEXT_PUBLIC_STUDENT_APP_URL}/activity`}
                  target="_blank"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                  Create Post
                </Link>
              </div>
            )}
            <RelatedUsers user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePublic;
