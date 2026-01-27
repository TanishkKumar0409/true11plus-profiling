import {
  BiMapPin,
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
      className={`flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-100 hover:shadow-sm transition-all duration-200 ${
        fullWidth ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div className="shrink-0 p-2.5 bg-purple-50 text-purple-600 rounded-lg">
        <Icon size={20} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-900 wrap-break-word">
          {value || <span className="text-gray-400 italic">Not set</span>}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BiMapPin className="text-purple-600" />
        Address & Location
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Address */}
        <DetailItem
          label="Street Address"
          value={user.address}
          icon={BiHome}
          fullWidth={true}
        />

        {/* City */}
        <DetailItem label="City" value={user.city} icon={BiBuildings} />

        {/* State */}
        <DetailItem
          label="State / Province"
          value={user.state}
          icon={BiMapAlt}
        />

        {/* Country */}
        <DetailItem label="Country" value={user.country} icon={BiGlobe} />

        {/* Pincode */}
        <DetailItem
          label="Postal / Zip Code"
          value={user.pincode}
          icon={BiTargetLock}
        />
      </div>
    </div>
  );
}
