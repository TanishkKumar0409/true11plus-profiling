import { useCallback, useEffect, useState, useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { API } from "../../contexts/API";
import {
  getErrorResponse,
  getStatusColor,
  getUserAvatar,
} from "../../contexts/Callbacks";
import type { DashboardOutletContextProps } from "../../types/Types";
import type { UserProps } from "../../types/UserProps";
import {
  BiEnvelope,
  BiMapPin,
  BiUser,
  BiShieldQuarter,
  BiLinkExternal,
} from "react-icons/bi";
import Tabs from "../../ui/tabs/Tab";
import Badge from "../../ui/badge/Badge";
import { BsShieldCheck, BsShieldX } from "react-icons/bs";
import BasicDetails from "./user-components/BasicDetails";
import Location from "./user-components/Location";
import UserPermissions from "./user-components/UserPermissions";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import CountUp from "react-countup";

export default function UserView() {
  const { objectId } = useParams();
  const { getRoleById, authUser } =
    useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProps | null>(null);

  const getProfileUser = useCallback(async () => {
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
    }
  }, [objectId, getRoleById]);

  useEffect(() => {
    getProfileUser();
  }, [getProfileUser]);

  const locationString = useMemo(() => {
    return [profileData?.city, profileData?.state, profileData?.country]
      .filter(Boolean)
      .join(", ");
  }, [profileData]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-purple-600 font-medium animate-pulse">
        Loading User Profile...
      </div>
    );
  }

  const InfoBlock = ({ icon: Icon, label, value, subValue }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
      <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className="text-sm font-bold text-gray-900 line-clamp-1"
          title={String(value)}
        >
          {value || "N/A"}
        </p>
        {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );

  const frontendUrl = `${import.meta.env.VITE_FRONT_URL}/profile/${profileData?.username}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <Breadcrumbs
        title="User Profile"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/dashboard/users" },
          { label: profileData?.username || "Profile" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <a
              href={frontendUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 backdrop-blur-sm rounded-full shadow-sm border border-white/50 transition-all transform hover:scale-105"
              title="View Public Profile"
            >
              <BiLinkExternal size={20} />
            </a>

            <div className="w-full aspect-2/1 bg-purple-600 relative">
              {profileData?.banner?.[0] && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${import.meta.env.VITE_MEDIA_URL}${profileData.banner[0]})`,
                  }}
                />
              )}
            </div>

            <div className="px-6 pb-8 text-center relative">
              <div className="-mt-12 mb-4 inline-block relative">
                <img
                  src={getUserAvatar(profileData?.avatar || [])}
                  alt={profileData?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                  {profileData?.verified ? (
                    <BsShieldCheck
                      className="text-green-500 w-5 h-5"
                      title="Verified"
                    />
                  ) : (
                    <BsShieldX
                      className="text-red-400 w-5 h-5"
                      title="Unverified"
                    />
                  )}
                </div>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {profileData?.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                @{profileData?.username}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge dot variant={getStatusColor(profileData?.status || "")}>
                  {profileData?.status}
                </Badge>
                <Badge dot>{profileData?.role}</Badge>
              </div>

              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                <div className="text-center px-2">
                  <span className="block text-lg font-bold text-gray-900">
                    {profileData?.verified ? "Verified" : "Unverified"}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Verified
                  </span>
                </div>
                <div className="text-center px-2">
                  <span className="block text-lg font-bold text-gray-900">
                    <CountUp
                      start={0}
                      end={profileData?.permissions?.length || 0}
                    />
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Perms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoBlock
                icon={BiEnvelope}
                label="Email Address"
                value={profileData?.email}
              />
              <InfoBlock
                icon={BiMapPin}
                label="Location"
                value={locationString}
                subValue={
                  profileData?.pincode
                    ? `Zip: ${profileData.pincode}`
                    : undefined
                }
              />
            </div>
          </div>
          <div>
            <Tabs
              tabs={tabs?.filter((item) => !item?.hide)}
              defaultTab={tabs?.[0]?.value}
              paramKey="tab"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
