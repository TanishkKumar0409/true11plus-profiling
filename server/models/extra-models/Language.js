import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const languageSchema = mongoose.Schema(
    {
        language: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Language = MainDatabase.model("language", languageSchema);

export default Language;
