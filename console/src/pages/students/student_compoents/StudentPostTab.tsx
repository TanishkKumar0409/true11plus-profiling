import { useCallback, useEffect, useState } from "react";
import type { UserProps } from "../../../types/UserProps";
import type { PostProps } from "../../../types/PostTypes";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { API } from "../../../contexts/API";
import Posts from "./post_compoent/Posts";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import PostCardSkeleton from "../../../ui/loading/ui/card/PostCardSkeleton";

export default function StudentPostTab({ user }: { user: UserProps | null }) {
  const { startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getPosts = useCallback(async () => {
    startLoadingBar();
    if (!user?._id) return;

    setIsFetching(true);

    try {
      const results = await Promise.allSettled([
        API.get(`/user/post/${user?._id}`),
        API.get(`/user/post/like-count/${user?._id}`),
      ]);

      const postsResult = results[0];
      const likesResult = results[1];

      const postData =
        postsResult.status === "fulfilled" ? postsResult.value.data : [];

      const likeData =
        likesResult.status === "fulfilled" ? likesResult.value.data || [] : [];

      const finalData = postData
        ?.filter((item: PostProps) => !item?.is_private)
        ?.map((po: PostProps) => {
          const likeFound = likeData.find(
            (lk: { postId: string }) => lk?.postId === po?._id,
          );
          return {
            ...po,
            all_images: po?.images?.map(
              (item) =>
                `${import.meta.env?.VITE_MEDIA_URL}/${item?.compressed}`,
            ),
            totalLikes: likeFound?.totalLikes || 0,
          };
        });

      setPosts(finalData);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsFetching(false);
      stopLoadingBar();
    }
  }, [user?._id]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isFetching)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(6)
          .fill(true)
          ?.map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
      </div>
    );
  return (
    <div>
      <Posts user={user} posts={posts} getPosts={getPosts} />
    </div>
  );
}
