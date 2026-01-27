// utils/editorImageDownloader.js
import axios from "axios";
import * as cheerio from "cheerio";
import sharp from "sharp";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDir } from "./FileOperations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrlPrefix = (url) => {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const isAlreadyOnBaseMedia = (src, baseMediaUrl) => {
  if (!src || !baseMediaUrl) return false;
  const cleanBase = normalizeUrlPrefix(baseMediaUrl);
  const cleanSrc = src.trim();
  return cleanSrc.startsWith(cleanBase);
};

const parseImageSrc = (src) => {
  try {
    const parsed = new URL(src, "http://localhost");
    return { protocol: parsed.protocol, parsed };
  } catch (error) {
    console.log(error);
    return { protocol: null, parsed: null };
  }
};

export const downloadImageBuffer = async (src) => {
  const response = await axios.get(src, { responseType: "arraybuffer" });
  const contentType = response.headers["content-type"];
  const ext = contentType?.split("/")[1]?.split(";")[0] || "jpg";
  return {
    buffer: Buffer.from(response.data),
    ext,
  };
};

export const base64ToBuffer = (src) => {
  const match =
    src.match(/data:image\/(png|jpg|jpeg|gif|webp);base64,(.+)/) || [];

  const format = match[1];
  const base64 = match[2];

  if (!format || !base64) {
    return { buffer: null, ext: null };
  }

  return {
    buffer: Buffer.from(base64, "base64"),
    ext: format,
  };
};

export const saveOriginalImage = async ({
  buffer,
  folderPath,
  timestamp,
  ext,
}) => {
  const safeExt = (ext || "jpg").toLowerCase();
  const originalFile = `img-editor-${timestamp}.${safeExt}`;
  const originalPath = path.join(folderPath, originalFile);

  fs.writeFileSync(originalPath, buffer);

  return { originalFile, originalPath };
};

export const saveWebpImage = async ({
  buffer,
  folderPath,
  timestamp,
  quality = 40,
}) => {
  const webpFile = `img-editor-${timestamp}-compressed.webp`;
  const webpPath = path.join(folderPath, webpFile);

  await sharp(buffer).webp({ quality }).toFile(webpPath);

  return { webpFile, webpPath };
};

export const processAndReplaceImageSrc = async ({
  src,
  img,
  folderPath,
  mediaUrlPrefix,
  baseMediaUrl,
  quality = 40,
}) => {
  try {
    if (!src) return;

    if (isAlreadyOnBaseMedia(src, baseMediaUrl)) return;

    if (src.startsWith(normalizeUrlPrefix(mediaUrlPrefix))) return;

    const { protocol } = parseImageSrc(src);

    await delay(1);
    const timestamp = Date.now();

    if (protocol === "data:") {
      const { buffer, ext } = base64ToBuffer(src);

      if (!buffer || !ext) {
        console.error("Invalid Base64 image format:", src.slice(0, 80));
        return;
      }

      await saveOriginalImage({ buffer, folderPath, timestamp, ext });
      const { webpFile } = await saveWebpImage({
        buffer,
        folderPath,
        timestamp,
        quality,
      });

      img.attr("src", `${normalizeUrlPrefix(mediaUrlPrefix)}/${webpFile}`);
      return;
    }

    if (protocol === "http:" || protocol === "https:") {
      const { buffer, ext } = await downloadImageBuffer(src);

      await saveOriginalImage({ buffer, folderPath, timestamp, ext });
      const { webpFile } = await saveWebpImage({
        buffer,
        folderPath,
        timestamp,
        quality,
      });

      img.attr("src", `${normalizeUrlPrefix(mediaUrlPrefix)}/${webpFile}`);
      return;
    }

    console.warn(`Unsupported protocol (${protocol}) in image src: ${src}`);
  } catch (error) {
    if (error?.response?.status === 404) {
      console.warn(`Image not found (404): ${src}`);
      img.remove();
    } else {
      console.error(`Failed to process image from ${src}:`, error.message);
    }
  }
};

export const downloadImageAndReplaceSrc = async (htmlContent, folder_name) => {
  try {
    if (!htmlContent || !folder_name) {
      console.error("Invalid input: htmlContent or folder_name is missing");
      return htmlContent;
    }

    const $ = cheerio.load(htmlContent);
    const downloadPromises = [];

    const folderPath = path.join(
      __dirname,
      `../../media/${folder_name}/editor`,
    );

    const baseMediaUrl = normalizeUrlPrefix(process.env.MEDIA_URL || "");
    const mediaUrlPrefix = `${baseMediaUrl}/${folder_name}/editor`;

    ensureDir(folderPath);

    $("img").each(function () {
      const img = $(this);
      const src = img.attr("src");
      if (!src) return;

      const promise = processAndReplaceImageSrc({
        src,
        img,
        folderPath,
        mediaUrlPrefix,
        baseMediaUrl,
        quality: 40,
      });

      downloadPromises.push(promise);
    });

    await Promise.all(downloadPromises);
    return $.html();
  } catch (error) {
    console.error("downloadImageAndReplaceSrc failed:", error.message);
    return htmlContent;
  }
};
