import Language from "../../models/extra-models/Language.js";
import UserLanguage from "../../models/user-models/UserLanguage.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";

export const addUserLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = await getDataFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!language || typeof language !== "string" || !language.trim()) {
      return res.status(400).json({ error: "Language is required" });
    }

    const cleanLanguage = language.trim().toLowerCase();

    let existingLanguage = await Language.findOne({ language: cleanLanguage });

    if (!existingLanguage)
      existingLanguage = await Language.create({ language: cleanLanguage });

    const alreadyAdded = await UserLanguage.findOne({
      userId,
      languageId: existingLanguage._id,
    });

    if (alreadyAdded)
      return res.status(409).json({ error: "Language already added" });

    await UserLanguage.create({ userId, languageId: existingLanguage._id });

    return res.status(201).json({ message: "Language added successfully" });
  } catch (error) {
    console.error("addUserLanguage error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteUserLanguage = async (req, res) => {
  try {
    const { userLanguageId } = req.params;
    const userId = await getDataFromToken(req);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!userLanguageId)
      return res.status(400).json({ error: "Invalid userLanguageId" });

    const deleted = await UserLanguage.findOneAndDelete({
      _id: userLanguageId,
      userId,
    });

    if (!deleted) return res.status(404).json({ error: "Language not found" });

    return res.status(200).json({ message: "Language removed successfully" });
  } catch (error) {
    console.error("deleteUserLanguage error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUserLanguages = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const userLanguages = await UserLanguage.find({ userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(userLanguages);
  } catch (error) {
    console.error("getUserLanguages error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
