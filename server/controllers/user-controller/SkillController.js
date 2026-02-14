import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserSkills from "../../models/user-models/UserSkills.js";
import Skills from "../../models/extra-models/Skills.js";
import mongoose from "mongoose";

export const addUserSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    const userId = await getDataFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!skill || typeof skill !== "string" || !skill.trim()) {
      return res.status(400).json({ error: "Skill is required" });
    }

    const cleanSkill = skill.trim().toLowerCase();

    let skillDoc = await Skills.findOne({ skill: cleanSkill });

    if (!skillDoc) {
      skillDoc = await Skills.create({
        skill: cleanSkill,
      });
    }

    const skillId = skillDoc._id;

    let userSkillDoc = await UserSkills.findOne({ userId });

    if (!userSkillDoc) {
      const newDoc = await UserSkills.create({
        userId,
        skill: [skillId],
      });

      return res.status(201).json({
        message: "Skill added successfully",
        data: newDoc,
      });
    }

    const exists = userSkillDoc.skill.some(
      (id) => id.toString() === skillId.toString(),
    );

    if (exists) {
      return res.status(200).json({
        message: "Skill already exists",
        data: userSkillDoc,
      });
    }

    userSkillDoc.skill.push(skillId);
    await userSkillDoc.save();

    return res.status(200).json({
      message: "Skill added successfully",
      data: userSkillDoc,
    });
  } catch (error) {
    console.error("addUserSkills error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteUserSkill = async (req, res) => {
  try {
    const { objectId } = req.params;

    const userIdRaw = await getDataFromToken(req);
    if (!userIdRaw) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!objectId || !mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ error: "Invalid objectId" });
    }

    const userId = new mongoose.Types.ObjectId(userIdRaw);
    const skillObjectId = new mongoose.Types.ObjectId(objectId);

    const updatedDoc = await UserSkills.findOneAndUpdate(
      { userId },
      {
        $pull: { skill: skillObjectId },
      },
      { new: true },
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "User skills not found" });
    }

    return res.status(200).json({
      message: "Skill deleted successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("deleteUserSkill error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
};

export const getSkillsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await UserSkills.findOne({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getSkillsByUserIdForShow = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await UserSkills.findOne({ userId })
      .sort({ createdAt: -1 })
      ?.populate("skill");
    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
