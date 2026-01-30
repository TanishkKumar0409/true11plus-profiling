import mongoose from "mongoose";
import UserTask from "../../models/user-academics/UserTasks.js";
import UserTaskSubmission from "../../models/user-academics/UserTaskSubmission.js";

export const upsertUserTask = async (req, res) => {
  try {
    const { user_id, tasks } = req.body;
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Valid user_id is required" });
    }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "tasks must be an array" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(user_id);
    const incomingTaskIds = tasks
      .filter((t) => t?.task_id && mongoose.Types.ObjectId.isValid(t.task_id))
      .map((t) => String(t.task_id));

    let userTask = await UserTask.findOne({
      user_id: studentObjectId,
    });

    if (!userTask) {
      userTask = await UserTask.create({
        user_id: studentObjectId,
        tasks: incomingTaskIds.map((id) => ({
          task_id: new mongoose.Types.ObjectId(id),
        })),
      });

      return res.status(201).json(userTask);
    }

    const existingTasksMap = new Map(
      userTask.tasks.map((t) => [String(t.task_id), t]),
    );

    const updatedTasks = incomingTaskIds.map((taskId) => {
      if (existingTasksMap.has(taskId)) {
        return existingTasksMap.get(taskId);
      }

      return { task_id: new mongoose.Types.ObjectId(taskId) };
    });

    userTask.tasks = updatedTasks;
    await userTask.save();

    return res.status(200).json(userTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
export const getUserTasks = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        error: "Valid user_id is required",
      });
    }

    const studentObjectId = new mongoose.Types.ObjectId(user_id);

    const userTask = await UserTask.findOne({
      user_id: studentObjectId,
    }).lean();

    if (!userTask) {
      return res.status(200).json({ error: "Task Not Found" });
    }

    return res.status(200).json(userTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const updateUserTaskStatus = async (req, res) => {
  try {
    const { user_id, task_id, status } = req.body;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Valid user_id is required" });
    }

    if (!task_id || !mongoose.Types.ObjectId.isValid(task_id)) {
      return res.status(400).json({ error: "Valid task_id is required" });
    }

    if (!status || typeof status !== "string") {
      return res.status(400).json({ error: "Valid status is required" });
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "approved" || normalizedStatus === "rejected") {
      await UserTaskSubmission.findOneAndUpdate(
        {
          task_id: new mongoose.Types.ObjectId(task_id),
          status: { $ne: "rejected" },
        },
        {
          $set: { status: normalizedStatus },
        },
      );
    }

    const updatedUserTask = await UserTask.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        "tasks.task_id": new mongoose.Types.ObjectId(task_id),
      },
      {
        $set: {
          "tasks.$.status": normalizedStatus,
        },
      },
      { new: true },
    );

    if (!updatedUserTask) {
      return res.status(404).json({ error: "User task or task not found" });
    }

    return res.status(200).json(updatedUserTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
export const updateTaskVerdictandStatus = async (req, res) => {
  try {
    const { user_id, task_id, status, grade, remark } = req.body;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Valid user_id is required" });
    }

    if (!task_id || !mongoose.Types.ObjectId.isValid(task_id)) {
      return res.status(400).json({ error: "Valid task_id is required" });
    }

    if (!status || !remark) {
      return res.status(400).json({
        error: "Remark and Approval/Rejection is required",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status option" });
    }

    if (status === "approved" && !grade) {
      return res.status(400).json({
        error: "Grade is required For Approve",
      });
    }

    const normalizedStatus = status.toLowerCase();

    const userObjectId = new mongoose.Types.ObjectId(user_id);
    const taskObjectId = new mongoose.Types.ObjectId(task_id);

    const updatedSubmission = await UserTaskSubmission.findOneAndUpdate(
      {
        task_id: taskObjectId,
        status: { $ne: "rejected" },
      },
      { $set: { status: normalizedStatus, grade, remark } },
    );

    const updatedUserTask = await UserTask.findOneAndUpdate(
      {
        user_id: userObjectId,
        "tasks.task_id": taskObjectId,
      },
      { $set: { "tasks.$.status": normalizedStatus } },
      { new: true },
    );

    if (!updatedUserTask) {
      return res.status(404).json({ error: "User task not found" });
    }

    return res
      .status(200)
      .json({ message: `Task ${normalizedStatus} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
};
