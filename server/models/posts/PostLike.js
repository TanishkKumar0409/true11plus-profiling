import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const postLikeSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "user-posts",
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true },
);

const PostLike = MainDatabase.model("post-like", postLikeSchema);

export default PostLike;
