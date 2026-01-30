import UserAssets from "../../models/user-models/UserAssets.js";
import {
  ensureDir,
  fileExists,
  moveSingleFile,
} from "../../utils/FileOperations.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import UserPosts from "../../models/posts/Posts.js";
import UserTaskSubmission from "../../models/user-academics/UserTaskSubmission.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEDIA_FOLDER_PATH = "../../../media";
const baseFilePath = "../../media/images";

export const UserMainImageMover = async (req, res, userId, fieldName) => {
  try {
    const oldDir = path.join(__dirname, baseFilePath);
    const newDir = path.join(
      __dirname,
      `${MEDIA_FOLDER_PATH}/profile/${userId}/main`,
    );
    await ensureDir(newDir);

    const user = await UserAssets.findOne({ userId });
    if (!user) {
      console.warn(`User not found for ID: ${userId}`);
      return;
    }

    if (!["avatar", "banner"].includes(fieldName)) {
      console.warn(`Invalid field name: ${fieldName}`);
      return;
    }

    const imageArray = user[fieldName];
    if (!Array.isArray(imageArray) || imageArray.length === 0) {
      console.warn(`No images found in field: ${fieldName}`);
      return;
    }

    const updatedImagePaths = [];
    const skippedFiles = [];

    for (const imgPath of imageArray) {
      const imgName = imgPath.split(/\\|\//).pop();
      if (imgPath.startsWith(`${userId}/main/`)) {
        updatedImagePaths.push(imgPath);
        continue;
      }

      const oldPath = path.join(oldDir, imgName);
      const newPath = path.join(newDir, imgName);

      if (await fileExists(oldPath)) {
        try {
          await fs.rename(oldPath, newPath);
          updatedImagePaths.push(`/profile/${userId}/main/${imgName}`);
        } catch (err) {
          console.warn(`Failed to move ${imgName}: ${err.message}`);
          skippedFiles.push(imgName);
        }
      } else {
        console.warn(`File not found: ${oldPath}`);
        skippedFiles.push(imgName);
      }
    }

    if (updatedImagePaths.length > 0) {
      user[fieldName] = updatedImagePaths;
      await user.save();
      console.log(`${fieldName} images for user ${userId} updated.`);

      if (skippedFiles.length > 0) {
        console.warn(`Some files were skipped: ${skippedFiles.join(", ")}`);
      }
    } else {
      console.warn(`No files were moved. Nothing saved for ${fieldName}`);
    }
  } catch (error) {
    console.error("Error in MainImageMover:", error);
  }
};

export const UserPostImageMover = async (req, res, userId) => {
  try {
    if (!userId) {
      console.warn("UserPostImageMover: userId is missing");
      return;
    }

    const oldDir = path.join(__dirname, baseFilePath);

    const newDir = path.join(
      __dirname,
      `${MEDIA_FOLDER_PATH}/profile/${userId}/posts`,
    );

    await ensureDir(newDir);

    const posts = await UserPosts.find({ userId });

    if (!posts || posts.length === 0) {
      console.warn(`No posts found for userId: ${userId}`);
      return;
    }

    let totalMoved = 0;
    let totalSkipped = 0;
    let totalUpdatedPosts = 0;

    for (const post of posts) {
      if (!Array.isArray(post.images) || post.images.length === 0) continue;

      let isPostUpdated = false;
      const updatedImages = [];
      const skippedFiles = [];

      for (const imgObj of post.images) {
        if (!imgObj || typeof imgObj !== "object") {
          updatedImages.push(imgObj);
          continue;
        }

        const updatedObj = { ...imgObj };

        // ✅ ORIGINAL
        if (imgObj.original && typeof imgObj.original === "string") {
          const result = await moveSinglePostImage({
            imgPath: imgObj.original,
            oldDir,
            newDir,
            userId,
            skippedFiles,
          });

          if (result.changed) {
            updatedObj.original = result.newPath;
            isPostUpdated = true;
            totalMoved += 1;
          } else {
            updatedObj.original = result.newPath;
            if (result.skipped) totalSkipped += 1;
          }
        }

        // ✅ COMPRESSED
        if (imgObj.compressed && typeof imgObj.compressed === "string") {
          const result = await moveSinglePostImage({
            imgPath: imgObj.compressed,
            oldDir,
            newDir,
            userId,
            skippedFiles,
          });

          if (result.changed) {
            updatedObj.compressed = result.newPath;
            isPostUpdated = true;
            totalMoved += 1;
          } else {
            updatedObj.compressed = result.newPath;
            if (result.skipped) totalSkipped += 1;
          }
        }

        updatedImages.push(updatedObj);
      }

      if (isPostUpdated) {
        post.images = updatedImages;
        await post.save();
        totalUpdatedPosts += 1;
      }

      if (skippedFiles.length > 0) {
        console.warn(
          `Skipped files for post ${post._id}: ${skippedFiles.join(", ")}`,
        );
      }
    }

    console.log(
      `UserPostImageMover Done -> userId: ${userId}, updatedPosts: ${totalUpdatedPosts}, movedFiles: ${totalMoved}, skippedFiles: ${totalSkipped}`,
    );
  } catch (error) {
    console.error("Error in UserPostImageMover:", error);
  }
};

const moveSinglePostImage = async ({
  imgPath,
  oldDir,
  newDir,
  userId,
  skippedFiles,
}) => {
  try {
    // already in correct final path
    if (
      imgPath.startsWith(`/profile/${userId}/posts/`) ||
      imgPath.startsWith(`profile/${userId}/posts/`)
    ) {
      const normalized = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
      return { changed: false, skipped: false, newPath: normalized };
    }

    const imgName = imgPath.split(/\\|\//).pop();

    if (!imgName) {
      return { changed: false, skipped: true, newPath: imgPath };
    }

    const oldPath = path.join(oldDir, imgName);
    const newPath = path.join(newDir, imgName);

    if (!(await fileExists(oldPath))) {
      console.warn(`File not found: ${oldPath}`);
      skippedFiles.push(imgName);
      return { changed: false, skipped: true, newPath: imgPath };
    }

    try {
      await fs.rename(oldPath, newPath);

      // ✅ final DB path
      const finalDbPath = `/profile/${userId}/posts/${imgName}`;
      return { changed: true, skipped: false, newPath: finalDbPath };
    } catch (err) {
      console.warn(`Failed to move ${imgName}: ${err.message}`);
      skippedFiles.push(imgName);
      return { changed: false, skipped: true, newPath: imgPath };
    }
  } catch (err) {
    console.warn(`moveSinglePostImage error: ${err.message}`);
    return { changed: false, skipped: true, newPath: imgPath };
  }
};

export const UserTaskSubmissionMover = async (userId) => {
  try {
    if (!userId) {
      console.warn("UserTaskSubmissionMover: userId missing");
      return;
    }

    const baseDir = path.join(__dirname, MEDIA_FOLDER_PATH);
    const submissionBaseDir = path.join(
      baseDir,
      "profile",
      String(userId),
      "task-submission",
    );

    const imageDir = path.join(submissionBaseDir, "images");
    const fileDir = path.join(submissionBaseDir, "files");

    await ensureDir(imageDir);
    await ensureDir(fileDir);

    const submissions = await UserTaskSubmission.find({
      user_id: userId,
    });

    if (!submissions.length) {
      console.warn(`No task submissions found for userId: ${userId}`);
      return;
    }

    let movedFiles = 0;
    let skippedFiles = 0;
    let updatedDocs = 0;

    for (const submission of submissions) {
      let isUpdated = false;

      if (Array.isArray(submission.images)) {
        const updatedImages = [];

        for (const img of submission.images) {
          if (!img) continue;

          const updatedImg = { ...img };

          if (img.original) {
            const result = await moveSingleFile({
              filePath: img.original,
              targetDir: imageDir,
              finalDbBase: `/profile/${userId}/task-submission/images`,
              fallbackSourceDir: "media/images",
            });

            updatedImg.original = result.newPath;
            if (result.changed) movedFiles++;
            if (result.skipped) skippedFiles++;
            if (result.changed) isUpdated = true;
          }

          if (img.compressed) {
            const result = await moveSingleFile({
              filePath: img.compressed,
              targetDir: imageDir,
              finalDbBase: `/profile/${userId}/task-submission/images`,
              fallbackSourceDir: "media/images",
            });

            updatedImg.compressed = result.newPath;
            if (result.changed) movedFiles++;
            if (result.skipped) skippedFiles++;
            if (result.changed) isUpdated = true;
          }

          updatedImages.push(updatedImg);
        }

        submission.images = updatedImages;
      }

      if (Array.isArray(submission.files)) {
        const updatedFiles = [];

        for (const file of submission.files) {
          if (!file?.filePath) {
            updatedFiles.push(file);
            continue;
          }

          const result = await moveSingleFile({
            filePath: file.filePath,
            targetDir: fileDir,
            finalDbBase: `/profile/${userId}/task-submission/files`,
            fallbackSourceDir: "media/files",
          });

          updatedFiles.push({
            ...file,
            filePath: result.newPath,
          });

          if (result.changed) movedFiles++;
          if (result.skipped) skippedFiles++;
          if (result.changed) isUpdated = true;
        }

        submission.files = updatedFiles;
      }

      if (isUpdated) {
        await submission.save();
        updatedDocs++;
      }
    }

    console.log(
      `UserTaskSubmissionMover DONE -> userId=${userId}, updatedDocs=${updatedDocs}, moved=${movedFiles}, skipped=${skippedFiles}`,
    );
  } catch (err) {
    console.error("UserTaskSubmissionMover error:", err);
  }
};
