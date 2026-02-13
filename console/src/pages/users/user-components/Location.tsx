import {
  BiBuildings,
  BiMapAlt,
  BiGlobe,
  BiTargetLock,
  BiHome,
} from "react-icons/bi";
import type { UserProps } from "../../../types/UserProps";

interface LocationProps {
  user: UserProps | null;
}

export default function Location({ user }: LocationProps) {
  if (!user) return null;

  const DetailItem = ({
    label,
    value,
    icon: Icon,
    fullWidth = false,
  }: {
    label: string;
    value?: string | number | null;
    icon: React.ElementType;
    fullWidth?: boolean;
  }) => (
    <div
      className={`flex items-start gap-4 p-4 bg-(--secondary-bg) hover:bg-(--main-subtle) transition-all duration-200 rounded-custom shadow-custom group ${
        fullWidth ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div className="shrink-0 p-2 bg-(--main-subtle) text-(--main) rounded-custom shadow-custom">
        <Icon size={20} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <span className="sub-paragraph font-semibold uppercase tracking-wide">
          {label}
        </span>
        <p className="font-medium break-all pt-0.5 group-hover:text-(--main)!">
          {value || <span className="text-(--text-color) italic">Not set</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-(--primary-bg) p-6 space-y-6 rounded-custom shadow-custom">
      <p className="font-bold text-(--text-color)">Address & Location</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailItem
          label="Street Address"
          value={user.address}
          icon={BiHome}
          fullWidth={true}
        />
        <DetailItem label="City" value={user.city} icon={BiBuildings} />
        <DetailItem
          label="State / Province"
          value={user.state}
          icon={BiMapAlt}
        />
        <DetailItem label="Country" value={user.country} icon={BiGlobe} />
        <DetailItem
          label="Postal / Zip Code"
          value={user.pincode}
          icon={BiTargetLock}
        />
      </div>
    </div>
  );
}
