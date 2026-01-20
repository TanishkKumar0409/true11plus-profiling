import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const CountrySchema = new mongoose.Schema(
  { country_name: { type: String } },
  { timestamps: true }
);

const Country = MainDatabase.model("Country", CountrySchema);

export default Country;
