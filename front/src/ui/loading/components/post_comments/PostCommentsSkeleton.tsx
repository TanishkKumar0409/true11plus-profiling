import React from "react";
import Skeleton from "react-loading-skeleton";

const CommentSkeleton = () => {
  const skeletonItems = [1, 2, 3, 4];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-(--primary-bg) rounded-custom shadow-custom">
      <div className="flex items-center mb-6">
        <Skeleton width={24} height={24} className="mr-2" />
        <Skeleton width={120} height={24} />
        <Skeleton circle width={32} height={24} className="ml-2" />
      </div>

      <div className="space-y-6">
        {skeletonItems.map((item) => (
          <div key={item} className="flex space-x-4">
            <div className="shrink-0">
              <Skeleton circle width={40} height={40} />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <Skeleton width={80} height={16} />
                <Skeleton width={110} height={12} />
              </div>

              <Skeleton width="75%" height={16} className="mb-2" />

              <div className="flex space-x-4">
                <Skeleton width={40} height={12} />
                <Skeleton width={40} height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-(--border) flex items-center space-x-4">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1">
          <Skeleton height={48} />
        </div>
        <Skeleton width={40} height={40} />
      </div>
    </div>
  );
};

export default CommentSkeleton;
