import Skeleton from "react-loading-skeleton";

export default function PostCommentSectionSkeleton() {
  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom flex flex-col h-150">
      <div className="p-5 border-b border-(--border) flex items-center gap-2">
        <Skeleton width={20} height={20} borderRadius={4} />
        <Skeleton width={100} height={18} />
        <Skeleton width={30} height={18} borderRadius={10} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <Skeleton circle width={64} height={64} className="mb-6" />
        <Skeleton width={180} height={20} className="mb-3" />
        <Skeleton width={280} height={14} />
        <Skeleton width={200} height={14} className="mt-2" />
      </div>

      <div className="p-5 border-t border-(--border)">
        <div className="flex items-center gap-4">
          <Skeleton circle width={40} height={40} className="shrink-0" />
          <div className="relative flex-1">
            <Skeleton height={50} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Skeleton width={32} height={32} baseColor="var(--main)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
