import Skeleton from "react-loading-skeleton";
export default function ProfileEditSkeleton() {
  return (
    <div>
      <div className="bg-(--primary-bg) rounded-custom p-4 shadow-custom space-y-3">
        <div className="space-y-2">
          <Skeleton width={300} height={16} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((field) => (
            <div key={field} className="space-y-3">
              <div className="flex justify-between">
                <Skeleton width={100} height={14} />
                {field === 5 && <Skeleton width={40} height={12} />}
              </div>
              <div className="relative">
                {field === 4 && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Skeleton width={24} height={16} />
                  </div>
                )}
                <Skeleton height={48} />
              </div>
            </div>
          ))}
          <div className="md:col-span-2 space-y-3">
            <div className="flex justify-between">
              <Skeleton width={80} height={14} />
              <Skeleton width={50} height={12} />
            </div>
            <Skeleton height={120} />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Skeleton
            width={160}
            height={48}
            borderRadius={10}
            baseColor="#a855f7"
          />
        </div>
      </div>
    </div>
  );
}
