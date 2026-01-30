import mongoose from "mongoose";
import { UserPostImageMover } from "../../helper/FileMovers/UserFileMover.js";
import UserPosts from "../../models/posts/Posts.js";
import { deleteFile } from "../../utils/FileOperations.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserTaskSubmission from "../../models/user-academics/UserTaskSubmission.js";

const maxImages = 5;
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = await getDataFromToken(req);

    const postImages = [];

    if (!req?.files?.images || req.files.images.length === 0) {
      return res.status(400).json({ error: "No images provided." });
    }

    if (req.files.images.length > maxImages) {
      return res
        .status(400)
        .json({ error: `You can upload a maximum of ${maxImages} images.` });
    }

    if (req.files?.images?.length) {
      req.files.images.forEach((file) => {
        const original = file.originalFilename;
        const compressed = file.webpFilename;
        if (original && compressed) {
          postImages.push({ original: original, compressed: compressed });
        }
      });
    }

    const newpost = new UserPosts({ userId, text, images: postImages });

    const savedPost = await newpost.save();

    if (savedPost) await UserPostImageMover(req, res, userId);

    return res.status(200).json({ message: "Post created Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await UserPosts.find({ userId })?.sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { objectId } = req.params;
    const delPost = await UserPosts.findOneAndDelete({ _id: objectId });
    if (!delPost) return res.status(404).json({ error: "Post Not Found" });

    if (delPost?.post_type !== "task") {
      delPost?.images?.map(async (item) => {
        await deleteFile(`../media/${item?.original}`);
        await deleteFile(`../media/${item?.compressed}`);
      });
    } else if (delPost?.post_type === "task") {
      await UserTaskSubmission.findOneAndUpdate(
        {
          _id: delPost?.submission_id,
          status: "approved",
        },
        { $set: { is_posted: false } },
      );
    }
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const editPost = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { objectId } = req.params;
    const { text, removeImages } = req.body;

    if (!objectId || !mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    const post = await UserPosts.findOne({ _id: objectId, userId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (typeof text === "string") {
      post.text = text;
    }

    let parsedRemoveImages = [];
    if (removeImages) {
      if (typeof removeImages === "string") {
        try {
          parsedRemoveImages = JSON.parse(removeImages);
        } catch (err) {
          return res
            .status(400)
            .json({ error: "removeImages must be valid JSON" });
        }
      } else if (Array.isArray(removeImages)) {
        parsedRemoveImages = removeImages;
      }
    }

    parsedRemoveImages = Array.isArray(parsedRemoveImages)
      ? parsedRemoveImages.filter(
          (img) =>
            img &&
            typeof img.original === "string" &&
            typeof img.compressed === "string",
        )
      : [];

    if (parsedRemoveImages.length > 0) {
      parsedRemoveImages?.map(async (item) => {
        await deleteFile(`../media/${item?.original}`);
        await deleteFile(`../media/${item?.compressed}`);
      });

      post.images = (post.images || []).filter((img) => {
        const shouldRemove = parsedRemoveImages.some(
          (r) => r.original === img.original && r.compressed === img.compressed,
        );
        return !shouldRemove;
      });
    }

    const newImages = [];

    if (req?.files?.images?.length) {
      req.files.images.forEach((file) => {
        const original = file.originalFilename;
        const compressed = file.webpFilename;

        if (original && compressed) {
          newImages.push({ original, compressed });
        }
      });
    }

    const existingCount = Array.isArray(post.images) ? post.images.length : 0;
    const totalAfterUpdate = existingCount + newImages.length;

    if (totalAfterUpdate > maxImages) {
      return res.status(400).json({
        error: `You can upload a maximum of ${maxImages} images. You already have ${existingCount} images.`,
      });
    }

    if (newImages.length > 0) {
      post.images = [...(post.images || []), ...newImages];
    }

    const updatedPost = await post.save();

    if (newImages.length > 0) {
      await UserPostImageMover(req, res, userId);
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getPostByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;
    const posts = await UserPosts.findOne({ _id: post_id });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const PostByUserTaskSubmission = async (req, res) => {
  try {
    const { submission_id, message, post_type } = req.body;
    const userId = await getDataFromToken(req);

    const submission = await UserTaskSubmission.findOne({
      _id: submission_id,
      status: "approved",
    });
    if (!submission) {
      return res.status(400).json({ error: "Incorrect Submission." });
    }
    const images = submission.images;

    const newpost = await UserPosts({
      userId,
      images,
      text: message,
      post_type,
      submission_id,
    });
    const savedPost = await newpost.save();
    if (!savedPost)
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again." });

    await UserTaskSubmission.findOneAndUpdate(
      {
        _id: submission_id,
        status: "approved",
      },
      { $set: { is_posted: true } },
    );

    return res.status(200).json({ message: "Your Activity Post Sucessfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const togglePostPrivate = async (req, res) => {
  try {
    const { post_id } = req.params;
    const authUserId = await getDataFromToken(req);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await UserPosts.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post?.userId?.toString() !== authUserId?.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    post.is_private = !post.is_private;

    await post.save();

    return res
      .status(200)
      .json({ message: "Post privacy updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const { post_id, status } = req.body;
    const authUserId = await getDataFromToken(req);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    if (!["approved", "rejected"]?.includes(status))
      return res.status(400).json({ error: "Invalid Action" });

    const post = await UserPosts.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.status = status;

    await post.save();

    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
