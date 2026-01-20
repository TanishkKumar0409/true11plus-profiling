import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const StateSchema = new mongoose.Schema(
  {
    name: { type: String },
    country_code: { type: String },
    country_name: { type: String },
  },
  { timestamps: true }
);

const State = MainDatabase.model("State", StateSchema);

export default State;
