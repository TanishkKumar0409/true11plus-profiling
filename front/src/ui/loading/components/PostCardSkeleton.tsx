'use client'

import Skeleton from 'react-loading-skeleton';

const PostCardSkeleton = () => {
  return (
    <div className="">
      <div className="space-y-6">
        <Skeleton width={200} height={28} className="mb-2" />
        <div className="p-6 rounded-custom shadow-custom">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton circle width={48} height={48} />
            <div className="space-y-2">
              <Skeleton width={120} height={18} />
              <Skeleton width={80} height={14} />
            </div>
          </div>
          <Skeleton count={2} className="mb-4" />
          <Skeleton height={300} borderRadius={12} className="mb-6" />
          <div className="flex justify-between border-t border-(--gray-subtle) pt-4">
            <Skeleton width={40} height={20} />
            <Skeleton width={80} height={20} />
            <Skeleton width={60} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;