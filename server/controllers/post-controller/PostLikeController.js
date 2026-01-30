import mongoose from "mongoose";
import PostLike from "../../models/posts/PostLike.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserPosts from "../../models/posts/Posts.js";

export const togglePostLike = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { postId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "You are not Login. please Login or register" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existingDoc = await PostLike.findOne({ postId: postObjectId });

    if (!existingDoc) {
      const created = await PostLike.create({
        postId: postObjectId,
        likedBy: [userObjectId],
      });

      return res.status(200).json({
        message: "Post liked",
        liked: true,
        totalLikes: created.likedBy.length,
      });
    }

    const alreadyLiked = existingDoc.likedBy.some((id) =>
      id.equals(userObjectId),
    );

    if (alreadyLiked) {
      const updated = await PostLike.findOneAndUpdate(
        { postId: postObjectId },
        { $pull: { likedBy: userObjectId } },
        { new: true },
      );

      return res.status(200).json({
        message: "Post unliked",
        liked: false,
        totalLikes: updated.likedBy.length,
      });
    }

    const updated = await PostLike.findOneAndUpdate(
      { postId: postObjectId },
      { $addToSet: { likedBy: userObjectId } },
      { new: true },
    );

    return res.status(200).json({
      message: "Post liked",
      liked: true,
      totalLikes: updated.likedBy.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong. Please try again",
    });
  }
};
export const getAllPostLikeCountsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userPosts = await UserPosts.find({ userId: userObjectId })
      .select("_id")
      .lean();

    const postIds = userPosts.map((p) => p._id);

    if (postIds.length === 0) {
      return res.status(200).json([]);
    }

    const likeCounts = await PostLike.aggregate([
      {
        $match: {
          postId: { $in: postIds },
        },
      },
      {
        $project: {
          _id: 0,
          postId: 1,
          totalLikes: { $size: "$likedBy" },
        },
      },
    ]);

    return res.status(200).json(likeCounts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};

export const getUserAllPostLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1) Get all posts of this user
    const userPosts = await UserPosts.find({ userId: userObjectId })
      .select("_id")
      .lean();

    const postIds = userPosts.map((p) => p._id);

    if (postIds.length === 0) {
      return res.status(200).json([]);
    }

    // 2) Get likes docs for those posts
    const likesData = await PostLike.find({ postId: { $in: postIds } })
      .select("postId likedBy")
      .lean();

    // 3) Return with totalLikes
    const finalData = likesData.map((item) => ({
      postId: item.postId,
      likedBy: item.likedBy || [],
      totalLikes: item.likedBy?.length || 0,
    }));

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};

export const getPostLikeByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;
    const postslikes = await PostLike.findOne({ postId: post_id });
    return res.status(200).json(postslikes);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};
