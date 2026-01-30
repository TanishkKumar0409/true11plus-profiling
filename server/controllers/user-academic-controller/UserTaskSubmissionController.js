import { UserTaskSubmissionMover } from "../../helper/FileMovers/UserFileMover.js";
import UserTask from "../../models/user-academics/UserTasks.js";
import UserTaskSubmission from "../../models/user-academics/UserTaskSubmission.js";

const maxImages = 5;

export const SubmitUserTask = async (req, res) => {
  try {
    const { user_id, task_id, message } = req.body;

    if (!user_id || !task_id) {
      return res.status(400).json({
        message: "user_id and task_id are required",
      });
    }

    const postImages = [];
    const postFiles = [];

    if (req.files?.images?.length) {
      if (req.files.images.length > maxImages) {
        return res.status(400).json({
          message: `Maximum ${maxImages} images allowed`,
        });
      }

      for (const file of req.files.images) {
        if (file.originalFilename && file.webpFilename) {
          postImages.push({
            original: file.originalFilename,
            compressed: file.webpFilename,
          });
        }
      }
    }

    if (req.files?.files?.length) {
      for (const file of req.files.files) {
        postFiles.push({
          filePath: file.path,
          fileName: file.originalname,
        });
      }
    }

    await UserTaskSubmission.create({
      user_id,
      task_id,
      message,
      images: postImages,
      files: postFiles,
    });

    await UserTaskSubmissionMover(user_id);

    const updateResult = await UserTask.updateOne(
      {
        user_id,
        "tasks.task_id": task_id,
      },
      {
        $set: {
          "tasks.$.status": "submitted",
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      console.warn(
        `Task not found for update -> user_id=${user_id}, task_id=${task_id}`,
      );
    }

    return res.status(201).json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error("SubmitUserTask error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserTaskSubmissionsByTaskId = async (req, res) => {
  try {
    const { task_id } = req.params;
    const allSubmissions = await UserTaskSubmission.find({ task_id });
    return res.status(200).json(allSubmissions);
  } catch (error) {
    console.error("SubmitUserTask error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
