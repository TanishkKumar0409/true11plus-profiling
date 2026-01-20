import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const CitySchema = new mongoose.Schema(
  {
    name: { type: String },
    state_code: { type: String },
    state_name: { type: String },
    country_code: { type: String },
    country_name: { type: String },
  },
  { timestamps: true }
);

const City = MainDatabase.model("City", CitySchema);

export default City;
