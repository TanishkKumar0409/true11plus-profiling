import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const userSocialLinksSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },

        facebook: { type: String, trim: true, },
        linkedin: { type: String, trim: true, },
        instagram: { type: String, trim: true, },
        youtube: { type: String, trim: true, },
        reddit: { type: String, trim: true, },
        discord: { type: String, trim: true, },
        twitterx: { type: String, trim: true, },
    },
    { timestamps: true }
);

const UserSocialLinks = MainDatabase.model(
    "user-social-links",
    userSocialLinksSchema
);

export default UserSocialLinks;
