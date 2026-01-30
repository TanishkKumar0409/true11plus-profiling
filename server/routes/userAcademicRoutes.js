import express from "express";
import {
  getUserTasks,
  updateTaskVerdictandStatus,
  updateUserTaskStatus,
  upsertUserTask,
} from "../controllers/user-academic-controller/UserTaskController.js";
import { upload } from "../utils/Multer.js";
import { processImage } from "../utils/ImageProcess.js";
import {
  getUserTaskSubmissionsByTaskId,
  SubmitUserTask,
} from "../controllers/user-academic-controller/UserTaskSubmissionController.js";

const userAcademicRoutes = express.Router();

userAcademicRoutes.post("/user/task/assign", upsertUserTask);
userAcademicRoutes.get("/user/task/:user_id", getUserTasks);
userAcademicRoutes.patch("/user/task/update/status", updateUserTaskStatus);
userAcademicRoutes.patch("/user/task/update/verdict", updateTaskVerdictandStatus);

const UserTaskSubmissionUpload = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "files" },
]);
userAcademicRoutes.post(
  `/user/task/submission`,
  UserTaskSubmissionUpload,
  processImage,
  SubmitUserTask,
);
userAcademicRoutes.get(
  `/user/task/submission/:task_id`,
  getUserTaskSubmissionsByTaskId,
);

export default userAcademicRoutes;
