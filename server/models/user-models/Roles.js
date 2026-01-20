import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserRoles = MainDatabase.model("role", roleSchema);

export default UserRoles;
