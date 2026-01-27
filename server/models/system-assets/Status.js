import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const StatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    parent_status: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const Status = MainDatabase.model("Status", StatusSchema);

export default Status;
