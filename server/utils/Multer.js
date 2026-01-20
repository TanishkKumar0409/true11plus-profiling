import multer from "multer";
import { ensureDir } from "../utils/FileOperations.js";
import path from "node:path";
import { generateSlug } from "./Callbacks.js";

const createStorage = (destination, prefix = "img") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDir(destination);
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const parsed = path.parse(file.originalname);
      const sluggedName = generateSlug(parsed.name);
      cb(null, `${prefix}-${Date.now()}-${sluggedName}${parsed.ext}`);
    },
  });

export const upload = multer({
  storage: createStorage("./media/images"),
  limits: { fileSize: 50 * 1024 * 1024 },
});
