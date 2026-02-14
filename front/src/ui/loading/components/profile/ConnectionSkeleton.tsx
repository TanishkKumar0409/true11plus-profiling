'use client'

import Skeleton from "react-loading-skeleton"

const ConnectionSkeleton = () => {
    return (
    <>
        <div className="p-6 rounded-custom shadow-custom">
            <Skeleton width={180} height={24} className="mb-2" />
            <Skeleton width={220} height={14} className="mb-6" />

            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between mb-5 last:mb-0">
                    <div className="flex items-center gap-3">
                        <Skeleton circle width={48} height={48} />
                        <div className="space-y-1">
                            <Skeleton width={100} height={16} />
                            <Skeleton width={80} height={12} />
                            <Skeleton width={60} height={12} />
                        </div>
                    </div>
                    <Skeleton circle width={36} height={36} />
                </div>
            ))}

            <div className="mt-6">
                <Skeleton height={45} borderRadius={12} />
            </div>
        </div>
    </>
    )
}

export default ConnectionSkeleton