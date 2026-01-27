import mongoose from "mongoose";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserSkills from "../../models/user-models/UserSkills.js";

export const addUserSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const userId = await getDataFromToken(req);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!skill || typeof skill !== "string" || !skill.trim())
      return res.status(400).json({ error: "Skill is required" });

    const cleanSkill = skill.trim().toLowerCase();

    const existingSkill = await UserSkills.findOne({
      userId,
      skill: cleanSkill,
    });

    if (existingSkill) {
      return res.status(409).json({ error: "Skill already exists" });
    }

    const newSkill = await UserSkills.create({
      userId,
      skill: cleanSkill,
    });

    return res.status(201).json({
      message: "Skill added successfully",
      data: newSkill,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const deleteUserSkill = async (req, res) => {
  try {
    const { objectId } = req.params;
    const userId = await getDataFromToken(req);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!objectId || !mongoose.Types.ObjectId.isValid(objectId))
      return res.status(400).json({ error: "Invalid skillId" });

    const deletedSkill = await UserSkills.findOneAndDelete({
      _id: objectId,
      userId,
    });

    if (!deletedSkill)
      return res.status(404).json({ error: "Skill not found" });

    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getSkillsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await UserSkills.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
