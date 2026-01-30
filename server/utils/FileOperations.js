import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

export const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

export const fileExists = async (filePath) => {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const deleteFile = async (relativePath) => {
  try {
    const absolutePath = path.resolve(relativePath);

    const exists = await fileExists(absolutePath);
    if (!exists) {
      console.warn(`File not found, skipping delete: ${absolutePath}`);
      return false;
    }

    await fsPromises.unlink(absolutePath);
    console.log(`Deleted file: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete file: ${relativePath}`, error);
    return false;
  }
};

export const moveSingleFile = async ({
  filePath,
  targetDir,
  finalDbBase,
  fallbackSourceDir,
}) => {
  try {
    if (!filePath || typeof filePath !== "string") {
      return { changed: false, skipped: true, newPath: filePath };
    }

    if (filePath.startsWith(finalDbBase)) {
      return { changed: false, skipped: false, newPath: filePath };
    }

    const fileName = path.basename(filePath);
    if (!fileName) {
      return { changed: false, skipped: true, newPath: filePath };
    }

    let oldAbsolutePath;

    if (!filePath.includes("/") && !filePath.includes("\\")) {
      oldAbsolutePath = path.join(process.cwd(), fallbackSourceDir, fileName);
    } else {
      oldAbsolutePath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
    }

    if (!(await fileExists(oldAbsolutePath))) {
      console.warn(`File not found: ${oldAbsolutePath}`);
      return { changed: false, skipped: true, newPath: filePath };
    }

    await ensureDir(targetDir);

    const newAbsolutePath = path.join(targetDir, fileName);

    await fsPromises.rename(oldAbsolutePath, newAbsolutePath);

    return {
      changed: true,
      skipped: false,
      newPath: `${finalDbBase}/${fileName}`,
    };
  } catch (err) {
    console.warn(`moveSingleFile error: ${err.message}`);
    return { changed: false, skipped: true, newPath: filePath };
  }
};
