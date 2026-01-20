import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const userLanguageSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        languageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "language",
            required: true,
        },
    },
    { timestamps: true }
);

const UserLanguage = MainDatabase.model("user-language", userLanguageSchema);

export default UserLanguage;
