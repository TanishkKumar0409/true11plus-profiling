import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const connectionRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      lowercase: true,
      default: "pending",
    },
  },
  { timestamps: true },
);

const UserConnectionRequest = MainDatabase.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
export default UserConnectionRequest;
