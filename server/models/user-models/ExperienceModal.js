import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const experienceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: { type: String, required: true },
    company: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String },
    iscurrently: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true },
);

const UserExperience = MainDatabase.model("user-experience", experienceSchema);

export default UserExperience;
