import { useOutletContext } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import CreatePostBar from "./profile-components/CreatePostBar";
import { ProfileHeader } from "./profile-components/post_components/ProfileHeader";
import type { DashboardOutletContextProps } from "../../types/Types";
import AllPosts from "./profile-components/AllPosts";
import { SuggestedUsers } from "../../components/suggestions/SuggestedUsers";
import { useCallback, useEffect, useState } from "react";
import type { PostProps } from "../../types/PostTypes";
import { getErrorResponse } from "../../contexts/CallBacks";
import { API } from "../../contexts/API";
import ProfileSkeleton from "../../ui/loading/pages/ProfileSkeletoon";

export default function Profile() {
  const { authUser, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getPosts = useCallback(async () => {
    startLoadingBar();
    if (!authUser?._id) return;

    setIsFetching(true);

    try {
      const results = await Promise.allSettled([
        API.get(`/user/post/${authUser?._id}`),
        API.get(`/user/post/like-count/${authUser?._id}`),
      ]);

      const postsResult = results[0];
      const likesResult = results[1];

      const postData =
        postsResult.status === "fulfilled" ? postsResult.value.data : [];

      const likeData =
        likesResult.status === "fulfilled" ? likesResult.value.data || [] : [];

      const finalData = postData.map((po: PostProps) => {
        const likeFound = likeData.find(
          (lk: { postId: string }) => lk?.postId === po?._id,
        );
        return {
          ...po,
          all_images: po?.images?.map(
            (item) => `${import.meta.env?.VITE_MEDIA_URL}/${item?.compressed}`,
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
  }, [authUser?._id, startLoadingBar, stopLoadingBar]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isFetching) return <ProfileSkeleton />;

  return (
    <div>
      <Breadcrumbs
        title={authUser?.username || ""}
        breadcrumbs={[
          { label: "Dashboard", path: "/" },
          { label: authUser?.username || "Profile", path: "/" },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatePostBar getPosts={getPosts} />
          <ProfileHeader />
          <AllPosts posts={posts} getPosts={getPosts} />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-16">
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </div>
  );
}
