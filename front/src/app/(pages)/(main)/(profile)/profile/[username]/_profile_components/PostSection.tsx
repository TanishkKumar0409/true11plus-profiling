import React, { useCallback, useEffect, useState } from 'react';
import { API } from '@/contexts/API';
import { getErrorResponse, getUserAvatar } from '@/contexts/Callbacks';
import { UserProps } from '@/types/UserProps';
import { ImImage } from 'react-icons/im';
import { formatDistanceToNow } from "date-fns";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { PostProps } from '@/types/PostTypes';
import PostFooter from './PostFooter';

const PostImageSlider = ({ images }: { images: { compressed: string }[] }) => {
    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="w-full aspect-[4/3] bg-gray-100 mt-3 border-y border-gray-100 relative group">
                <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${images[0]?.compressed}`}
                    alt="Post content"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className="post-card-swiper mt-3 group cursor-pointer relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                navigation
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                className="w-full h-full"
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <div className='aspect-[4/3] group relative w-full h-full'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img?.compressed}`}
                                alt={`Slide ${idx}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute top-3 group-hover:block hidden transition-all right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium z-10 pointer-events-none">
                            {idx + 1} / {images.length}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const PostCard = ({ post, user, authUser }: { post: PostProps, user: UserProps | null, authUser: UserProps | null }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={getUserAvatar(user?.avatar || [])}
                            alt={user?.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                        />
                        <div className="flex flex-col">
                            <h4 className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors">
                                {user?.name || "Unknown User"}
                            </h4>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap leading-relaxed px-1">
                    {post.text}
                </p>
            </div>

            <PostImageSlider images={post.images} />
            <PostFooter post={post} user={user} authUser={authUser} />
        </div>
    );
};

export default function PostSection({ user, authUser }: { user: UserProps | null, authUser: UserProps | null }) {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    const getPosts = useCallback(async () => {
        if (!user?._id) return;
        setIsFetching(true);
        try {
            const results = await Promise.allSettled([
                API.get(`/user/post/${user?._id}`),
                API.get(`/user/all/post/like/${user?._id}`),
            ]);

            const postsResult = results[0];
            const likesResult = results[1];

            const postData = postsResult.status === "fulfilled" ? postsResult.value.data : [];
            const likeData = likesResult.status === "fulfilled" ? likesResult.value.data : [];

            const finalData = postData.map((po: PostProps) => {
                const likeFound = likeData.find(
                    (lk: { postId: string }) => lk?.postId?.toString() === po?._id?.toString()
                );
                return {
                    ...po,
                    likedBy: likeFound?.likedBy || [],
                };
            });

            setPosts(finalData);

            if (postsResult.status === "rejected") getErrorResponse(postsResult.reason, true);
            if (likesResult.status === "rejected") getErrorResponse(likesResult.reason, true);

        } catch (error) {
            getErrorResponse(error, true);
        } finally {
            setIsFetching(false);
        }
    }, [user?._id]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    if (isFetching) {
        return (
            <div className="mt-6 space-y-5">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse">
                        <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2 flex-1">
                                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                                <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="h-32 bg-gray-100 rounded mb-4"></div>
                        <div className="h-8 w-full bg-gray-50 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!isFetching && (!posts || posts.length === 0)) {
        return (
            <div className="mt-6 text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                    <ImImage className="text-gray-300 w-7 h-7" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No posts yet</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                    {user?.username} hasn&apos;t shared any updates or articles recently.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-900">Activity</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {posts.length} Posts
                </span>
            </div>
            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} user={user} authUser={authUser} />
                ))}
            </div>
        </div>
    );
}