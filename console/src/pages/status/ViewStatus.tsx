import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import type {
  DashboardOutletContextProps,
  StatusProps,
} from "../../types/Types";
import { BiCategory, BiDetail, BiHash } from "react-icons/bi";
import Badge from "../../ui/badge/Badge";

export default function ViewStatus() {
  const { objectId } = useParams();
  const [statusData, setStatusData] = useState<StatusProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { allStatus } = useOutletContext<DashboardOutletContextProps>();

  useEffect(() => {
    setLoading(true);
    if (allStatus?.length > 0) {
      const found = allStatus.find((item) => item?._id === objectId) || null;
      setStatusData(found);
      setLoading(false);
    } else {
      setStatusData(null);
    }
  }, [objectId, allStatus]);

  const DetailItem = ({
    label,
    value,
    icon: Icon,
    isBadge = false,
  }: {
    label: string;
    value?: string | null;
    icon: React.ElementType;
    isBadge?: boolean;
  }) => (
    <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
        <Icon className="text-purple-500" size={16} />
        {label}
      </div>
      {isBadge && value ? (
        <div className="flex">
          <Badge children={value} />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-base">
          {value || <span className="text-gray-400 italic">Not available</span>}
        </span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-purple-600 animate-pulse">
        Loading Status Details...
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="text-center py-10 text-gray-500">
        Status not found or deleted.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="View Status"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Status", path: "/dashboard/status" },
          { label: statusData.status_name || "View Status" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem
            label="Status Name"
            value={statusData.status_name}
            icon={BiHash}
          />

          <DetailItem
            label="Parent Status"
            value={statusData.parent_status || "Root (No Parent)"}
            icon={BiCategory}
            isBadge={!!statusData.parent_status}
          />

          <div className="md:col-span-2">
            <div className="flex flex-col gap-2 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BiDetail className="text-purple-500" size={18} />
                Description
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                {statusData.description ? (
                  statusData.description
                ) : (
                  <span className="text-gray-400 italic">
                    No description provided for this status.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
