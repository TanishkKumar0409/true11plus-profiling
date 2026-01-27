import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const academicGroupshema = mongoose.Schema(
  {
    academic_group: {
      type: String,
      required: true,
      lowercase: true,
    },
    academic_classess: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
    status: {
      type: String,
      default: "active",
      lowercase: true,
    },
  },
  { timestamps: true },
);

const AcademicGroup = MainDatabase.model("academic-group", academicGroupshema);
export default AcademicGroup;
