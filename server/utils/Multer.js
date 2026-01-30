import multer from "multer";
import path from "node:path";
import { ensureDir } from "../utils/FileOperations.js";
import { generateSlug } from "./Callbacks.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination = "./media/images";

    if (file.fieldname === "images") {
      destination = "./media/images";
    } else if (file.fieldname === "files") {
      destination = "./media/files";
    }

    ensureDir(destination);
    cb(null, destination);
  },

  filename: (req, file, cb) => {
    const parsed = path.parse(file.originalname);
    const sluggedName = generateSlug(parsed.name);

    // 👇 Dynamic prefix by field name
    let prefix = "file";
    if (file.fieldname === "images") prefix = "img";
    if (file.fieldname === "files") prefix = "doc";

    cb(null, `${prefix}-${Date.now()}-${sluggedName}${parsed.ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024,
  },
});
