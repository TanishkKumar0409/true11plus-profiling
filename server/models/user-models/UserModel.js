import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MainDatabase } from "../../database/Databases.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, unique: true },
    avatar: { type: [String] },
    password: { type: String, required: true },
    verfied: { type: Boolean, default: false },
    verifytoken: { type: String },
    verifytokenexpiry: { type: Date },
    role: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = MainDatabase.model("User", userSchema);

export default User;
