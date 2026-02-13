import mongoose from "mongoose";
import Language from "../../models/extra-models/Language.js";
import UserLanguage from "../../models/user-models/UserLanguage.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";

export const addUserLanguage = async (req, res) => {
  try {
    const { language } = req.body;

    const userIdRaw = await getDataFromToken(req);
    if (!userIdRaw) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!language || typeof language !== "string" || !language.trim()) {
      return res.status(400).json({ error: "Language is required" });
    }

    const cleanLanguage = language.trim().toLowerCase();
    const userId = new mongoose.Types.ObjectId(userIdRaw);

    let languageDoc = await Language.findOne({ language: cleanLanguage });

    if (!languageDoc) {
      languageDoc = await Language.create({ language: cleanLanguage });
    }

    const languageId = languageDoc._id;

    const updatedDoc = await UserLanguage.findOneAndUpdate(
      { userId },
      {
        $addToSet: { languageId: languageId },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return res.status(200).json({
      message: "Language added successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("addUserLanguage error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteUserLanguage = async (req, res) => {
  try {
    const { objectId } = req.params;

    const userIdRaw = await getDataFromToken(req);
    if (!userIdRaw) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!objectId || !mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ error: "Invalid languageId" });
    }

    const userId = new mongoose.Types.ObjectId(userIdRaw);
    const langObjectId = new mongoose.Types.ObjectId(objectId);

    const updatedDoc = await UserLanguage.findOneAndUpdate(
      { userId },
      {
        $pull: { languageId: langObjectId },
      },
      { new: true },
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "User language not found" });
    }

    return res.status(200).json({
      message: "Language removed successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("deleteUserLanguage error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUserLanguages = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const userLanguages = await UserLanguage.findOne({ userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(userLanguages);
  } catch (error) {
    console.error("getUserLanguages error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
