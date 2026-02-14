'use client'

import Skeleton from "react-loading-skeleton"

const LanguageInfoSkeleton = () => {
    return (
        <>
            {/* Languages Card */}
            <div className="rounded-custom shadow-custom p-6">
                <Skeleton className="mb-5" />
                <div className="space-y-3">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        </>
    )
}

export default LanguageInfoSkeleton;