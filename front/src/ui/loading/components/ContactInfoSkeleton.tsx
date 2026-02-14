'use client'

import Skeleton from 'react-loading-skeleton';

const ContactResponsiveSkeleton = () => {
    return (
        <>
            <div className="p-6 rounded-custom shadow-custom">

                <div className="mb-6">
                    <Skeleton width={220} height={28} />
                </div>

                {/* Contact Details List */}
                <div className="space-y-3 mb-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-4">
                            {/* Square Icon Skeleton */}
                            <Skeleton width={36} height={36} />

                            {/* Label and Value Text */}
                            <div className="flex-1 space-y-2">
                                <Skeleton width={120} height={12} />
                                <Skeleton width="60%" height={14} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Section Divider */}
                <div className="border-t border-(--gray-subtle) pt-6 ">
                    <Skeleton width={160} height={24} className="mb-3" />
                </div>

                {/* Social Icons Grid */}
                <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((icon) => (
                        <Skeleton key={icon} width={30} height={30} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ContactResponsiveSkeleton;