import sharp from "sharp";
import path from "node:path";
import { generateSlug } from "./Callbacks.js";

export const processImage = async (req, res, next) => {
  if (!req.files) return next();

  try {
    for (const fieldName in req.files) {
      for (const file of req.files[fieldName]) {
        // 🚫 Skip non-image files
        if (!file.mimetype || !file.mimetype.startsWith("image/")) {
          continue;
        }

        const inputPath = file.path;
        const destinationFolder = path.dirname(inputPath);

        const parsed = path.parse(file.filename);
        const sluggedName = generateSlug(parsed.name);
        const outputFilename = `${sluggedName}-compressed.webp`;
        const outputPath = path.join(destinationFolder, outputFilename);

        await sharp(inputPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 40 })
          .toFile(outputPath);

        // Attach metadata (used later in controller)
        file.originalFilename = file.filename;
        file.originalPath = inputPath;
        file.webpFilename = outputFilename;
        file.webpPath = outputPath;
        file.isImage = true;
      }
    }

    next();
  } catch (error) {
    console.error("Image processing error:", error);
    return res.status(500).json({ error: "Image processing failed" });
  }
};
