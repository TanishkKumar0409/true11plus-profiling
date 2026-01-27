import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const taskSchema = mongoose.Schema(
  {
    academic_group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "academic-group",
    },
    title: { type: String, required: true },
    objective: { type: String, required: true },
    final_deliverable: { type: String, required: true },
    important_details: { type: String },
    difficulty_level: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    task_type: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    steps_to_implement: { type: String },
    duration: {
      duration_value: { type: Number, required: true },
      duration_type: { type: String, required: true },
    },
    status: { type: String, default: "active", lowercase: true },
  },
  { timestamps: true },
);

const Task = MainDatabase.model("task", taskSchema);

export default Task;
