import express from "express";
import {
  addStatus,
  deleteStatus,
  getAllStatus,
  updateStatus,
} from "../controllers/system-assets-controller/StatusController.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/system-assets-controller/CategoryController.js";

const SystemAssetsRoutes = express.Router();

SystemAssetsRoutes.post(`/status/add`, addStatus);
SystemAssetsRoutes.get(`/status/all`, getAllStatus);
SystemAssetsRoutes.delete(`/status/delete/:objectId`, deleteStatus);
SystemAssetsRoutes.patch(`/status/update/:objectId`, updateStatus);

SystemAssetsRoutes.post(`/category/add`, createCategory);
SystemAssetsRoutes.get(`/category/all`, getAllCategory);
SystemAssetsRoutes.delete(`/category/delete/:objectId`, deleteCategory);
SystemAssetsRoutes.patch(`/category/update/:objectId`, updateCategory);

export default SystemAssetsRoutes;
