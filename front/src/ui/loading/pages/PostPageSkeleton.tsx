import React from "react";
import PostCardSkeleton from "../components/profile/PostCardSkeleton";
import CommentSkeleton from "../components/post_comments/PostCommentsSkeleton";
import ConnectionSkeleton from "../components/profile/ConnectionSkeleton";

export default function PostPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24 pb-12 sm:px-8 px-4 bg-(--secondary-bg)">
      <div className="lg:col-span-1 space-y-6 mb-6">
        <PostCardSkeleton />
      </div>
      <div className="lg:col-span-2">
        <CommentSkeleton />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-25">
          <ConnectionSkeleton />
        </div>
      </div>
    </div>
  );
}
