import Skeleton from "react-loading-skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom space-y-4">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton circle width={45} height={45} />
            <div>
              <Skeleton width={100} height={14} className="mb-1" />
              <div className="flex gap-2">
                <Skeleton width={80} height={10} />
                <Skeleton width={50} height={10} />
              </div>
            </div>
          </div>
          <Skeleton width={20} height={10} />
        </div>
        <Skeleton width="60%" height={14} />
      </div>
      <Skeleton height={450} borderRadius={12} />
      <div className="flex justify-between p-4">
        <Skeleton width={50} height={15} />
        <Skeleton width={80} height={15} />
        <Skeleton width={50} height={15} />
      </div>
    </div>
  );
}
