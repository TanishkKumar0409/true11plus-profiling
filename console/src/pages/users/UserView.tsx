import { useCallback, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { API } from "../../contexts/API";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
} from "../../contexts/Callbacks";
import type { DashboardOutletContextProps } from "../../types/Types";
import type { UserProps } from "../../types/UserProps";
import { BiMapPin, BiUser, BiShieldQuarter } from "react-icons/bi";
import Tabs from "../../ui/tabs/Tab";
import Badge from "../../ui/badge/Badge";
import { BsShieldCheck, BsShieldX } from "react-icons/bs";
import BasicDetails from "./user-components/BasicDetails";
import Location from "./user-components/Location";
import UserPermissions from "./user-components/UserPermissions";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import UserViewSkeleton from "../../ui/loading/pages/UserViewSkeleton";

export default function UserView() {
  const { objectId } = useParams();
  const { getRoleById, authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProps | null>(null);

  const getProfileUser = useCallback(async () => {
    startLoadingBar();
    setLoading(true);
    try {
      const userRes = await API.get(`/user/${objectId}`);
      const baseData = userRes.data;

      const fullProfile = {
        ...baseData,
        role: getRoleById(baseData.role),
      };

      setProfileData(fullProfile);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
      stopLoadingBar();
    }
  }, [objectId, getRoleById]);

  useEffect(() => {
    getProfileUser();
  }, [getProfileUser]);

  const tabs = [
    {
      label: "Basic Details",
      value: "basic-details",
      icon: <BiUser />,
      component: <BasicDetails user={profileData} />,
    },
    {
      label: "Location",
      value: "location",
      icon: <BiMapPin />,
      component: <Location user={profileData} />,
      hide: false,
    },
    {
      label: "Permissions",
      value: "permissions",
      icon: <BiShieldQuarter />,
      component: <UserPermissions user={profileData} />,
      hide: false,
    },
  ];
  useEffect(() => {
    if (
      !loading &&
      profileData?.role === "bot admin" &&
      authUser?.role !== "bot admin"
    ) {
      window.location.href = "/dashboard/users";
    }
  }, [loading, profileData, authUser?.role]);

  if (loading) return <UserViewSkeleton />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="User Profile"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/dashboard/users" },
          { label: profileData?.username || "Profile" },
        ]}
      />

      <div className="items-start space-y-6">
        <div>
          <div className="bg-(--primary-bg) overflow-hidden sticky top-6 h-full rounded-custom  shadow-custom">
            <div className="absolute z-100 flex flex-wrap right-3 top-3 gap-2 mb-6">
              <Badge dot variant={getStatusColor(profileData?.status || "")}>
                {profileData?.status}
              </Badge>
              <Badge dot>{profileData?.role}</Badge>
            </div>
            <div className="w-full aspect-2/1 bg-(--main) h-64 relative">
              {profileData?.banner?.[0] && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${import.meta.env.VITE_MEDIA_URL}${profileData.banner[0]})`,
                  }}
                />
              )}
            </div>

            <div className="sm:flex items-center justify-between px-6 pb-8 sm:text-start text-center relative">
              <div className="sm:flex gap-6">
                <div className="-mt-12 mb-4 inline-block relative">
                  <img
                    src={getUserAvatar(profileData?.avatar || [])}
                    alt={profileData?.name}
                    className="w-32 h-32 rounded-full border-4 border-(--white) shadow-custom object-cover bg-(--primary-bg)"
                  />
                  <div className="flex absolute bottom-4 right-0 bg-(--primary-bg) rounded-full h-8 w-8 justify-center items-center shadow-custom">
                    {profileData?.verified ? (
                      <BsShieldCheck
                        className="text-(--success) w-4 h-4"
                        title="Verified"
                      />
                    ) : (
                      <BsShieldX
                        className="text-(--danger) w-4 h-4"
                        title="Unverified"
                      />
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <h1 className="font-bold text-(--text-color)">
                    {profileData?.name}
                  </h1>
                  <p>@{profileData?.username}</p>
                </div>
              </div>
              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>

        <Tabs
          tabs={tabs?.filter((item) => !item?.hide)}
          defaultTab={tabs?.[0]?.value}
          paramKey="tab"
        />
      </div>
    </div>
  );
}
