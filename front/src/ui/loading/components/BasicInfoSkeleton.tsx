'use client'

import Skeleton from "react-loading-skeleton"

const BasicInfoSkeleton = () => {
    return (
        <>
            <div className="rounded-custom overflow-hidden shadow-custom">
                <Skeleton height={200} />
                <div className="px-6 pb-8 -mt-12 relative z-5">
                    {/* Profile Image Circle */}
                    <Skeleton circle width={100} height={100} className="border-4 border-(--primary-bg) shadow-custom mb-4" />

                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton width={120} height={28} />
                            <Skeleton width={80} height={18} />
                            <div className="flex items-center space-x-2 pt-2">
                                <Skeleton circle width={16} height={16} />
                                <Skeleton width={140} height={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BasicInfoSkeleton;