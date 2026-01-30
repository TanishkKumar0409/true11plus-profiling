import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const userTaskSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tasks: {
      type: [
        {
          task_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          status: {
            type: String,
            default: "assign",
            lowercase: true,
          },
        },
      ],
    },
  },
  { timestamps: true },
);

const UserTask = MainDatabase.model("user-task", userTaskSchema);

export default UserTask;
