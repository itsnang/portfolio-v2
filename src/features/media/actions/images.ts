"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { NotFoundError, UploadImagesError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";
import {
  getCloudinaryImages,
  getCloudinaryFolders,
  createCloudinaryFolder,
} from "@/lib/cloudinary";
import { uploadToCloudinaryFolder } from "@/features/media/utils/upload";
import { MAX_FILE_SIZE } from "@/features/media/constants";

export const getFolders = async () => {
  try {
    const folders = await getCloudinaryFolders();
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw new NotFoundError();
  }
};

export const createFolder = async (folderName: string) => {
  try {
    await createCloudinaryFolder(folderName);
    return { success: true };
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new UploadImagesError();
  }
};

export const uploadStagedFile = async (
  stagedFile: File | Blob,
  folderPath: string
) => {
  if (stagedFile.size > MAX_FILE_SIZE) {
    throw new UploadImagesError(
      `File is too large (${(stagedFile.size / (1024 * 1024)).toFixed(1)}MB). Max is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    );
  }

  const fileName = stagedFile instanceof File ? stagedFile.name : "upload";
  const fileBuffer = await stagedFile.arrayBuffer();
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = `data:${stagedFile.type};base64,${base64Data}`;

  let imgUrl: string;
  try {
    const result = await uploadToCloudinaryFolder(
      fileUri,
      fileName,
      folderPath
    );
    imgUrl = result.imageUrl;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Cloudinary's SDK rejects with a plain { message, name, http_code } object,
    // not a real Error instance, so check for a message property directly.
    const message =
      (error && typeof error === "object" && "message" in error
        ? String(error.message)
        : undefined) ?? "Upload to Cloudinary failed";
    throw new UploadImagesError(message);
  }

  const imageUpload = await db
    .insert(TbImages)
    .values({
      imageUrl: imgUrl,
      isActive: true,
    })
    .returning()
    .then(ok)
    .catch(err);

  if (imageUpload.error) {
    console.error("Failed to save uploaded image record:", imageUpload.error);
    throw new UploadImagesError("Image uploaded but failed to save record");
  }

  return imageUpload.value;
};

export const getImages = async (folderPath?: string) => {
  try {
    const images = await getCloudinaryImages(folderPath);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new NotFoundError();
  }
};
