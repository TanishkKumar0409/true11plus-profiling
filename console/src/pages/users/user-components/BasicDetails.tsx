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
    <div className="flex items-start gap-4 p-4 bg-(--secondary-bg) hover:bg-(--main-subtle) transition-all duration-200 rounded-custom shadow-custom group">
      <div className="shrink-0 p-2 bg-(--main-subtle) text-(--main) rounded-custom shadow-custom">
        <Icon size={20} />
      </div>
      <div className="flex flex-col w-full">
        <span className="sub-paragraph font-semibold uppercase tracking-wide">
          {label}
        </span>
        {children ? (
          children
        ) : (
          <p className="font-medium break-all pt-0.5 group-hover:text-(--main)!">
            {value || (
              <span className="text-(--text-color) italic">Not set</span>
            )}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-(--primary-bg) p-6 rounded-custom shadow-custom space-y-6">
      <p className="font-bold text-(--text-color) ">Personal Informations</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailItem label="Full Name" value={user?.name} icon={BiUser} />
        <DetailItem
          label="Username"
          value={`@${user?.username}`}
          icon={BiHash}
        />
        <DetailItem
          label="Email Address"
          value={user?.email}
          icon={BiEnvelope}
        />
        <DetailItem
          label="Mobile Number"
          value={user?.mobile_no}
          icon={BiPhone}
        />
        <DetailItem label="Account Status" icon={BiShield}>
          <div className="flex">
            <Badge variant={getStatusColor(user.status || "")} dot={true}>
              {user?.status}
            </Badge>
          </div>
        </DetailItem>
        <DetailItem label="Role" icon={BiUser}>
          <div>
            <Badge children={user?.role} />
          </div>
        </DetailItem>
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
