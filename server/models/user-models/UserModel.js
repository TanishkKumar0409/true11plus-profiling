import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MainDatabase } from "../../database/Databases.js";

const SALT_ROUNDS = 10;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile_no: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
    permissions: { type: [mongoose.Schema.Types.ObjectId], ref: "permissions" },
    status: { type: String, default: "active", lowercase: true },
    verified: { type: Boolean, default: false },
    verifytoken: { type: String },
    verifytokenexpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    is_google_login: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return bcrypt.compare(String(enteredPassword), this.password);
};

const User = MainDatabase.model("User", userSchema);

export default User;
