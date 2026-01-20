import UserSocialLinks from "../../models/user-models/UserSocialLinks.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";

export const addOrUpdateUserSocialLinks = async (req, res) => {
    try {
        const userId = await getDataFromToken(req);
        const { facebook, linkedin, instagram, youtube, reddit, discord, twitterx, } = req.body;

        const updatedLinks = await UserSocialLinks.findOneAndUpdate(
            { userId },
            {
                $set: {
                    facebook: typeof facebook === "string" ? facebook.trim() : "",
                    linkedin: typeof linkedin === "string" ? linkedin.trim() : "",
                    instagram: typeof instagram === "string" ? instagram.trim() : "",
                    youtube: typeof youtube === "string" ? youtube.trim() : "",
                    reddit: typeof reddit === "string" ? reddit.trim() : "",
                    discord: typeof discord === "string" ? discord.trim() : "",
                    twitterx: typeof twitterx === "string" ? twitterx.trim() : "",
                },
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            message: "Social links saved successfully",
            data: updatedLinks,
        });
    } catch (error) {
        console.error("addOrUpdateUserSocialLinks error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export const getUserSocialLinksByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const links = await UserSocialLinks.findOne({ userId });

        if (!links) {
            return res.status(200).json({ error: "Social links fetched successfully", });
        }

        return res.status(200).json(links);
    } catch (error) {
        console.error("getUserSocialLinksByUserId error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};