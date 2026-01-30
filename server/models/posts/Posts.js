import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
    },
    images: {
      type: [{ original: String, compressed: String }],
    },
    status: {
      type: String,
      default: "pending",
    },
    is_private: {
      type: Boolean,
      default: true,
    },
    post_type: {
      type: String,
      default: "mannual",
    },
    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

const UserPosts = MainDatabase.model("user-posts", postSchema);

export default UserPosts;
