import { ImImage } from 'react-icons/im';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import EditPostModal from './EditPostModal';
import type { PostProps } from '../../../types/PostTypes';
import { useState } from 'react';

const PostImagesCarousel = ({ images }: { images: any[] }) => {
    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="w-full aspect-4/3 bg-gray-100 mt-3 border-y border-gray-100">
                <img
                    src={`${import.meta.env.VITE_MEDIA_URL}${images[0]?.compressed}`}
                    alt="Post content"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="post-card-swiper relative w-full aspect-4/3 bg-gray-100 mt-3 border-y border-gray-100 overflow-hidden group">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-full"
                loop
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={`${import.meta.env.VITE_MEDIA_URL}${img?.compressed}`}
                            alt={`Slide ${idx}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium z-10 pointer-events-none">
                            {idx + 1} / {images.length}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

// --- Main Posts Component ---
export default function Posts({ posts, getPosts }: { posts: PostProps[], getPosts: () => void }) {
    const [editPost, setEditPost] = useState<PostProps | null>(null)

    if (!posts || posts.length <= 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ImImage className="text-gray-300 w-8 h-8" />
                </div>
                <h3 className="text-gray-900 font-medium">No activity yet</h3>
                <p className="text-gray-500 text-sm mt-1">Posts from you and your connections will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div
                    key={post._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible hover:shadow-md transition-shadow duration-200"
                >
                    <PostHeader
                        post={post}
                        onDelete={getPosts}
                        setEditPost={setEditPost}
                    />
                    <PostImagesCarousel images={post.images} />
                    <PostFooter post={post} />
                    <EditPostModal isOpen={editPost} post={post} onClose={() => setEditPost(null)} onSuccess={getPosts} />
                </div>
            ))}
        </div>
    );
}