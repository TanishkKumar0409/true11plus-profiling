import { useCallback, useEffect, useState } from "react";
import type { UserProps } from "../../../types/UserProps";
import type { PostProps } from "../../../types/PostTypes";
import { getErrorResponse } from "../../../contexts/Callbacks";
import { API } from "../../../contexts/API";
import Posts from "./post_compoent/Posts";

export default function StudentPostTab({ user }: { user: UserProps | null }) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getPosts = useCallback(async () => {
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
            totalLikes: likeFound?.totalLikes || 0,
          };
        });

      setPosts(finalData);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsFetching(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isFetching) return <>Loading post....</>;
  return (
    <div>
      <Posts user={user} posts={posts} getPosts={getPosts} />
    </div>
  );
}
