import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";
import PostCommentSectionSkeleton from "./PostCommentSectionSkeleton";

export default function PostCommentSkeleton() {
  return (
    <div>
      <BreadCrumbsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-3">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-(--primary-bg) rounded-custom shadow-custom space-y-4">
            <div className="flex items-center gap-3 p-4 pb-0">
              <Skeleton circle width={44} height={44} />
              <div className="space-y-1">
                <Skeleton width={100} height={14} />
                <Skeleton width={80} height={10} />
              </div>
            </div>

            <Skeleton height={350} borderRadius={12} />

            <div className="space-y-3 p-4 pb-0">
              <Skeleton width={120} height={10} />
              <div className="flex gap-3">
                <div className="w-1 h-10 bg-(--main) rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton width="100%" height={12} />
                  <Skeleton width="60%" height={12} />
                </div>
              </div>
            </div>

            <div className="flex justify-between p-4 pt-0">
              <Skeleton width={50} height={14} />
              <Skeleton width={50} height={14} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <PostCommentSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
