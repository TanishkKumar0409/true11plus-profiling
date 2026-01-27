import express from "express";
import { getAllAcademicClass } from "../controllers/academic-structure-controller/AcademicClassController.js";
import {
  getAllAcademicGroups,
  upsertAcademicGroup,
} from "../controllers/academic-structure-controller/AcademicGroupController.js";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskByObjectId,
  updateTask,
} from "../controllers/academic-structure-controller/TaskController.js";

const academicStructureRoutes = express.Router();

academicStructureRoutes.get(`/academic/class/all`, getAllAcademicClass);

academicStructureRoutes.get(`/academic/group/all`, getAllAcademicGroups);
academicStructureRoutes.post(`/academic/group/create`, upsertAcademicGroup);

academicStructureRoutes.post(`/task/create`, createTask);
academicStructureRoutes.get(`/task/all`, getAllTask);
academicStructureRoutes.get(`/task/:objectId`, getTaskByObjectId);
academicStructureRoutes.patch(`/task/update/:objectId`, updateTask);
academicStructureRoutes.delete(`/task/delete/:objectId`, deleteTask);

export default academicStructureRoutes;
