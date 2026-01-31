import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const UserAssetSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    avatar: {
      type: [String],
    },
    banner: {
      type: [String],
    },
    website: {
      type: String,
    },
    title: { type: String },
    about: {
      type: String,
    },
  },
  { timestamps: true },
);

const UserAssets = MainDatabase.model("user-assets", UserAssetSchema);

export default UserAssets;
