import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const UserTaskSubmissionSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    task_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: {
      type: String,
    },
    files: {
      type: [
        {
          filePath: String,
          fileName: String,
        },
      ],
    },
    images: {
      type: [{ original: String, compressed: String }],
    },
    status: {
      type: String,
      default: "submitted",
      lowercase: true,
    },
    is_posted: {
      type: Boolean,
      default: false,
    },
    grade: { type: String },
    remark: { type: String },
  },
  { timestamps: true },
);

const UserTaskSubmission = MainDatabase.model(
  "user-task-submission",
  UserTaskSubmissionSchema,
);

export default UserTaskSubmission;
