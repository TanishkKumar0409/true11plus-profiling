import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const academicClassScheam = mongoose.Schema(
  {
    academic_class: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      default: "active",
      lowercase: true,
    },
  },
  { timestamps: true },
);

const AcademicClass = MainDatabase.model("academic-class", academicClassScheam);
export default AcademicClass;
