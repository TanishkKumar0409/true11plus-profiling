import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const connectionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    status: {
      type: String,
      lowercase: true,
      default: "pending",
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

const UserConnections = MainDatabase.model("Connection", connectionSchema);
export default UserConnections;
