import {
  BiUser,
  BiEnvelope,
  BiPhone,
  BiHash,
  BiShield,
  BiCalendarCheck,
  BiLogIn,
  BiCheckCircle,
  BiXCircle,
} from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import type { UserProps } from "../../../types/UserProps";
import Badge from "../../../ui/badge/Badge";
import { formatDate, getStatusColor } from "../../../contexts/Callbacks";
import { formatDistanceToNow } from "date-fns";

interface BasicDetailsProps {
  user: UserProps | null;
}

export default function BasicDetails({ user }: BasicDetailsProps) {
  if (!user) return null;

  const DetailItem = ({
    label,
    value,
    icon: Icon,
    children,
  }: {
    label: string;
    value?: string | number | null;
    icon: React.ElementType;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-100 hover:shadow-sm transition-all duration-200">
      <div className="shrink-0 p-2.5 bg-purple-50 text-purple-600 rounded-lg">
        <Icon size={20} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {children ? (
          children
        ) : (
          <span className="text-sm font-medium text-gray-900 break-all">
            {value || <span className="text-gray-400 italic">Not set</span>}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BiUser className="text-purple-600" />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Name */}
        <DetailItem label="Full Name" value={user?.name} icon={BiUser} />

        {/* Username */}
        <DetailItem
          label="Username"
          value={`@${user?.username}`}
          icon={BiHash}
        />

        {/* Email */}
        <DetailItem
          label="Email Address"
          value={user?.email}
          icon={BiEnvelope}
        />

        {/* Mobile */}
        <DetailItem
          label="Mobile Number"
          value={user?.mobile_no}
          icon={BiPhone}
        />

        {/* Status */}
        <DetailItem label="Account Status" icon={BiShield}>
          <div className="flex">
            <Badge variant={getStatusColor(user.status || "")} dot={true}>
              {user?.status}
            </Badge>
          </div>
        </DetailItem>

        {/* Role */}
        <DetailItem label="Role" icon={BiUser}>
          <div>
            <Badge children={user?.role} />
          </div>
        </DetailItem>

        {/* Login Method */}
        <DetailItem label="Login Method" icon={BiLogIn}>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {user.googleId ? (
              <>
                <BsGoogle className="text-red-500" />
                <span>Google Auth</span>
              </>
            ) : (
              <>
                <BiEnvelope className="text-gray-500" />
                <span>Email & Password</span>
              </>
            )}
          </div>
        </DetailItem>

        {/* Verified Status */}
        <DetailItem
          label="Verification"
          icon={user.verified ? BiCheckCircle : BiXCircle}
        >
          <div
            className={`flex items-center gap-2 text-sm font-medium ${user.verified ? "text-green-600" : "text-red-600"}`}
          >
            {user.verified ? "Verified Account" : "Unverified"}
          </div>
        </DetailItem>

        {/* Registered At */}
        <DetailItem label="Registered On" icon={BiCalendarCheck}>
          {formatDate(user?.createdAt)}{" "}
          <span className="capitalize font-bold">
            ({formatDistanceToNow(user?.createdAt)})
          </span>
        </DetailItem>
      </div>
    </div>
  );
}
