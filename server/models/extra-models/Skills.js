import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const skillsSchema = mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const Skills = MainDatabase.model("Skills", skillsSchema);

export default Skills;
