'use client'

import Skeleton from "react-loading-skeleton"

const ExperienceInfoSkeleton = () => {
    return (

        <div className="p-6 rounded-custom shadow-custom">
            <Skeleton width={120} height={24} className="mb-6" />
            {[1, 2].map((i) => (
                <div key={i} className="mb-8 last:mb-0">
                    <Skeleton width={150} height={18} className="mb-2" />
                    <div className="bg-(--secondary-bg) p-4 rounded-custom space-y-3">
                        <Skeleton width={120} height={20} />
                        <Skeleton width={100} height={25} borderRadius={20} />
                        <Skeleton count={2} height={12} />
                    </div>
                </div>
            ))}
        </div>

    )
}

export default ExperienceInfoSkeleton;

