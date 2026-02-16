import mongoose from "mongoose";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import { Comment } from "../../models/posts/PostComment.js";
import UserAssets from "../../models/user-models/UserAssets.js";

export const addPostComment = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { postId, content, parentId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "You are not logged in. Please login or register." });
    }

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return res.status(400).json({ error: "Content is required" });
    }

    let parentComment = null;

    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: "Invalid parentId" });
      }

      parentComment = await Comment.findOne({
        _id: new mongoose.Types.ObjectId(parentId),
        postId: new mongoose.Types.ObjectId(postId),
      });

      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }

      if (parentComment.parentId) {
        return res.status(400).json({
          error:
            "Replying to a reply is not allowed. You can only reply to top-level comments.",
        });
      }
    }

    const newComment = await Comment.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(userId),
      content: content.trim(),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    });

    if (parentComment) {
      await Comment.updateOne(
        { _id: parentComment._id },
        { $inc: { replyCount: 1 } },
      );
    }

    return res.status(200).json({
      message: parentComment
        ? "Reply added successfully"
        : "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error in addPostComment:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again" });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);

    // 1) Fetch comments + populate user
    const comments = await Comment.find({ postId: postObjectId })
      .populate("userId") // keep this as you want
      .sort({ createdAt: -1 })
      .lean();

    if (!comments || comments.length === 0) {
      return res.status(200).json([]);
    }

    const userIds = [
      ...new Set(
        comments.map((c) => c?.userId?._id?.toString()).filter(Boolean),
      ),
    ].map((id) => new mongoose.Types.ObjectId(id));

    const userAssetsDocs = await UserAssets.find({ userId: { $in: userIds } })
      .select("userId avatar")
      .lean();

    const assetsMap = new Map();
    userAssetsDocs.forEach((doc) => {
      assetsMap.set(doc.userId.toString(), doc);
    });

    // 5) Attach avatar to userId object inside comments
    const finalComments = comments.map((c) => {
      const uid = c?.userId?._id?.toString();
      const assets = uid ? assetsMap.get(uid) : null;

      return {
        ...c,
        userId: {
          ...c.userId,
          avatar: assets?.avatar || null,
        },
      };
    });

    return res.status(200).json(finalComments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};

export const toggleCommentLike = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ error: "commentId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }

    const commentObjectId = new mongoose.Types.ObjectId(commentId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const comment = await Comment.findById(commentObjectId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const alreadyLiked = (comment.likedBy || []).some(
      (id) => id.toString() === userObjectId.toString(),
    );
    if (alreadyLiked) {
      const updated = await Comment.findByIdAndUpdate(
        commentObjectId,
        { $pull: { likedBy: userObjectId } },
        { new: true },
      ).lean();

      return res.status(200).json({
        message: "Comment unliked",
        liked: false,
        totalLikes: updated?.likedBy?.length || 0,
      });
    }

    // If not liked -> like
    const updated = await Comment.findByIdAndUpdate(
      commentObjectId,
      { $addToSet: { likedBy: userObjectId } },
      { new: true },
    ).lean();

    return res.status(200).json({
      message: "Comment liked",
      liked: true,
      totalLikes: updated?.likedBy?.length || 0,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};

export const deleteCommentWithChildren = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ error: "commentId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }

    const commentObjectId = new mongoose.Types.ObjectId(commentId);

    const comment = await Comment.findById(commentObjectId).lean();

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this comment" });
    }

    if (comment.parentId) {
      await Comment.updateOne(
        { _id: comment.parentId },
        { $inc: { replyCount: -1 } },
      );
    }
    await Comment.deleteMany({
      $or: [{ _id: commentObjectId }, { parentId: commentObjectId }],
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something Went Wrong. Please try again" });
  }
};
export const countCommentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Step 1: find all postIds where user commented
    const userPosts = await Comment.distinct("postId", {
      userId: userObjectId,
    });

    if (!userPosts.length) {
      return res.status(200).json([]);
    }

    // Step 2: aggregate counts per post
    const results = await Comment.aggregate([
      {
        $match: {
          postId: { $in: userPosts },
        },
      },
      {
        $group: {
          _id: "$postId",
          all: { $sum: 1 },
          main: {
            $sum: {
              $cond: [{ $eq: ["$parentId", null] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          all: 1,
          main: 1,
        },
      },
    ]);

    return res.status(200).json(results);
  } catch (error) {
    console.error("COUNT COMMENT BY USER ERROR:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};