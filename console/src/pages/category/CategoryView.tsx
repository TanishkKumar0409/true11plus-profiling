import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import {
  BiCategory,
  BiDetail,
  BiLayer,
  BiCheckCircle,
  BiXCircle,
} from "react-icons/bi";
import type {
  CategoryProps,
  DashboardOutletContextProps,
} from "../../types/Types";
import Badge from "../../ui/badge/Badge";
import { getStatusColor } from "../../contexts/Callbacks";

export default function CategoryView() {
  const { objectId } = useParams();
  const { allCategory } = useOutletContext<DashboardOutletContextProps>();

  const [categoryData, setCategoryata] = useState<CategoryProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allCategory?.length > 0) {
      const found = allCategory.find((item) => item._id === objectId);
      if (found) {
        setCategoryata(found);
        setLoading(false);
      }
    } else {
      setCategoryata(null);
    }
  }, [objectId, allCategory]);

  const DetailItem = ({
    label,
    value,
    icon: Icon,
    isBadge = false,
  }: {
    label: string;
    value?: string;
    icon: React.ElementType;
    isBadge?: boolean;
  }) => (
    <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100 h-full">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
        <Icon className="text-purple-500" size={18} />
        {label}
      </div>
      {isBadge ? (
        <div className="flex">
          <Badge children={value} variant={getStatusColor(value || "")} />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-base">
          {value || <span className="text-gray-400 italic">N/A</span>}
        </span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-purple-600 animate-pulse font-medium">
        Loading Category Details...
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="text-center py-10 text-gray-500">Category not found.</div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <Breadcrumbs
        title="View Category"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Category", path: "/dashboard/category" },
          { label: "Details" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailItem
            label="Category Name"
            value={categoryData.category_name}
            icon={BiCategory}
          />

          <DetailItem
            label="Parent Category"
            value={categoryData?.parent_category}
            icon={BiLayer}
          />

          <DetailItem
            label="Status"
            value={categoryData.status}
            icon={categoryData.status === "active" ? BiCheckCircle : BiXCircle}
            isBadge={true}
          />

          <div className="md:col-span-3 mt-4">
            <div className="flex flex-col gap-3 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
                <BiDetail className="text-purple-500" size={20} />
                Description / Content
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: categoryData.description }}
              />

              {!categoryData.description && (
                <span className="text-gray-400 italic">
                  No description provided.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
