import Task from "../../models/academic-structure-models/TaskModel.js";
import { downloadImageAndReplaceSrc } from "../../utils/EditorImagesController.js";

export const createTask = async (req, res) => {
  try {
    const {
      academic_group_id,
      title,
      task_type,
      objective,
      final_deliverable,
      important_details,
      difficulty_level,
      duration_value,
      duration_type,
      steps_to_implement,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    if (!objective || typeof objective !== "string" || !objective.trim()) {
      return res.status(400).json({ error: "objective is required" });
    }

    if (
      !final_deliverable ||
      typeof final_deliverable !== "string" ||
      !final_deliverable.trim()
    ) {
      return res.status(400).json({ error: "final_deliverable is required" });
    }

    const durationValueNum = Number(duration_value);
    if (!Number.isFinite(durationValueNum) || durationValueNum <= 0) {
      return res
        .status(400)
        .json({ error: "duration_value must be a number greater than 0" });
    }

    if (
      !duration_type ||
      typeof duration_type !== "string" ||
      !duration_type.trim()
    ) {
      return res.status(400).json({ error: "duration_type is required" });
    }

    const updatedObjective = objective
      ? await downloadImageAndReplaceSrc(objective, "task")
      : "";

    const updatedSteps = steps_to_implement
      ? await downloadImageAndReplaceSrc(steps_to_implement, "task")
      : "";

    const updatedFinalDeliverable = final_deliverable
      ? await downloadImageAndReplaceSrc(final_deliverable, "task")
      : "";

    const updatedImportantDetails = important_details
      ? await downloadImageAndReplaceSrc(important_details, "task")
      : "";

    const newTask = await Task.create({
      academic_group_id: academic_group_id,
      title: title.trim(),
      objective: updatedObjective,
      final_deliverable: updatedFinalDeliverable,
      important_details: updatedImportantDetails,
      difficulty_level: difficulty_level,
      steps_to_implement: updatedSteps,
      task_type,
      duration: {
        duration_value: durationValueNum,
        duration_type: duration_type.trim(),
      },
    });

    return res.status(201).json({
      message: "Task Created Successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("createTask error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find()?.populate(
     "academic_group_id difficulty_level task_type",
    );
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("createTask error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const getTaskByObjectId = async (req, res) => {
  try {
    const { objectId } = req.params;
    const tasks = await Task.findOne({ _id: objectId })?.populate(
      "academic_group_id difficulty_level task_type",
    );
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("createTask error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { objectId } = req.params;

    if (!objectId)
      return res.status(400).json({ error: "task id is required" });

    const existingTask = await Task.findById(objectId);
    if (!existingTask) return res.status(404).json({ error: "Task not found" });

    const {
      academic_group_id,
      title,
      objective,
      final_deliverable,
      important_details,
      difficulty_level,
      duration_value,
      duration_type,
      steps_to_implement,
      status,
      task_type,
    } = req.body;

    const updateData = {};

    if (academic_group_id !== undefined)
      updateData.academic_group_id = academic_group_id;

    if (title !== undefined) updateData.title = title.trim();

    if (objective !== undefined) {
      updateData.objective = await downloadImageAndReplaceSrc(
        objective,
        "task",
      );
    }

    if (final_deliverable !== undefined) {
      updateData.final_deliverable = await downloadImageAndReplaceSrc(
        final_deliverable,
        "task",
      );
    }

    if (important_details !== undefined) {
      updateData.important_details = await downloadImageAndReplaceSrc(
        important_details,
        "task",
      );
    }

    if (difficulty_level !== undefined)
      updateData.difficulty_level = difficulty_level;

    if (task_type !== undefined) updateData.task_type = task_type;

    if (steps_to_implement !== undefined) {
      updateData.steps_to_implement = await downloadImageAndReplaceSrc(
        steps_to_implement,
        "task",
      );
    }

    if (duration_value !== undefined || duration_type !== undefined) {
      const durationValueNum = Number(duration_value);
      const durationTypeStr = String(duration_type).trim();

      if (!Number.isFinite(durationValueNum) || durationValueNum <= 0) {
        return res
          .status(400)
          .json({ error: "duration_value must be a number greater than 0" });
      }

      if (!durationTypeStr) {
        return res.status(400).json({ error: "duration_type is required" });
      }

      updateData.duration = {
        duration_value: durationValueNum,
        duration_type: durationTypeStr,
      };
    }

    if (status !== undefined) updateData.status = status;

    await Task.findByIdAndUpdate(objectId, updateData);

    return res.status(200).json({ message: "Task Updated Successfully" });
  } catch (error) {
    console.error("updateTask error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { objectId } = req.params;
    const delTask = await Task.findByIdAndDelete(objectId);
    if (!delTask) return res.status(404).json({ error: "Task Not Found" });
    return res.status(200).json({ message: "Task Deleted Successfully." });
  } catch (error) {
    console.error("updateTask error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
