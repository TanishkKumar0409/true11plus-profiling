import mongoose from "mongoose";
import AcademicGroup from "../../models/academic-structure-models/AcademicGroup.js";

export const getAllAcademicGroups = async (req, res) => {
  try {
    const allgroups = await AcademicGroup.find();
    return res.status(200).json(allgroups);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const upsertAcademicGroup = async (req, res) => {
  try {
    const { group_id, academic_group, academic_classess, status } = req.body;

    if (!academic_group || typeof academic_group !== "string") {
      return res.status(400).json({ error: "academic_group is required" });
    }

    const cleanGroup = academic_group.trim().toLowerCase();
    if (!cleanGroup) {
      return res.status(400).json({ error: "academic_group is required" });
    }

    if (!Array.isArray(academic_classess) || academic_classess.length === 0) {
      return res
        .status(400)
        .json({ error: "academic_classess must be a non-empty array" });
    }

    const validIds = [];
    for (const id of academic_classess) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ error: `Invalid academic_classess id: ${id}` });
      }
      validIds.push(new mongoose.Types.ObjectId(id));
    }

    const uniqueIds = [...new Set(validIds.map((x) => x.toString()))].map(
      (x) => new mongoose.Types.ObjectId(x),
    );

    if (group_id && !mongoose.Types.ObjectId.isValid(group_id)) {
      return res.status(400).json({ error: "Invalid academic group id" });
    }

    const conflictFilter = {
      academic_classess: { $in: uniqueIds },
    };

    if (group_id) {
      conflictFilter._id = { $ne: new mongoose.Types.ObjectId(group_id) };
    }

    const conflictGroup = await AcademicGroup.findOne(conflictFilter).lean();

    if (conflictGroup) {
      return res.status(400).json({
        error:
          "One or more selected classes are already assigned to another academic group.",
        conflict_group_id: conflictGroup._id,
        conflict_group_name: conflictGroup.academic_group,
      });
    }

    const payload = {
      academic_group: cleanGroup,
      academic_classess: uniqueIds,
      status: typeof status === "string" ? status.toLowerCase() : "active",
    };

    let result;

    if (group_id) {
      result = await AcademicGroup.findOneAndUpdate(
        { _id: group_id },
        { $set: payload },
        {
          new: true,
          upsert: false,
          runValidators: true,
        },
      );

      if (!result) {
        return res.status(404).json({ error: "Academic group not found" });
      }

      return res.status(200).json({
        message: "Academic group updated successfully.",
        data: result,
      });
    }

    // ✅ CREATE MODE
    result = await AcademicGroup.create(payload);

    return res.status(201).json({
      message: "Academic group created successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
