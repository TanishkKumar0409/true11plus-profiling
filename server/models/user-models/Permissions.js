import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const permissionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "roles",
      required: true,
    },
    permissions: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true },
);

const UserPermissions = MainDatabase.model("permissions", permissionsSchema);
export default UserPermissions;
