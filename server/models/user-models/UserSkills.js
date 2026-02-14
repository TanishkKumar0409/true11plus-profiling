import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const SkillSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    skill: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "skills",
      trim: true,
    },
  },
  { timestamps: true },
);
const UserSkills = MainDatabase.model("user-skills", SkillSchema);
export default UserSkills;
