"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { withAuthAction } from "@/lib/auth/middleware";
import {
  getCloudinaryImages,
  getCloudinaryFolders,
  createCloudinaryFolder,
} from "@/lib/cloudinary";
import { uploadToCloudinaryFolder } from "@/features/media/utils/upload";
import { MAX_FILE_SIZE } from "@/features/media/constants";

export const getFolders = withAuthAction(async (auth) => {
  if (!auth.profile) {
    return { success: false as const, error: "Profile not found." };
  }

  try {
    const folders = await getCloudinaryFolders();
    return {
      success: true as const,
      data: folders,
      message: "Folders loaded",
    };
  } catch (error) {
    console.error("Error fetching folders:", error);
    return { success: false as const, error: "Failed to fetch folders" };
  }
});

export const createFolder = withAuthAction(
  async (auth, folderName: string) => {
    if (!auth.profile) {
      return { success: false as const, error: "Profile not found." };
    }

    try {
      await createCloudinaryFolder(folderName);
      return {
        success: true as const,
        data: { name: folderName },
        message: "Folder created successfully",
      };
    } catch (error) {
      console.error("Error creating folder:", error);
      return { success: false as const, error: "Failed to create folder" };
    }
  }
);

export const uploadStagedFile = withAuthAction(
  async (auth, stagedFile: File | Blob, folderPath: string) => {
    if (!auth.profile) {
      return { success: false as const, error: "Profile not found." };
    }

    if (stagedFile.size > MAX_FILE_SIZE) {
      return {
        success: false as const,
        error: `File is too large (${(stagedFile.size / (1024 * 1024)).toFixed(1)}MB). Max is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      };
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
      return { success: false as const, error: message };
    }

    try {
      const [created] = await db
        .insert(TbImages)
        .values({
          imageUrl: imgUrl,
          isActive: true,
        })
        .returning({ id: TbImages.id, imageUrl: TbImages.imageUrl });

      return {
        success: true as const,
        data: created,
        message: "Image uploaded",
      };
    } catch (error) {
      console.error("Failed to save uploaded image record:", error);
      return {
        success: false as const,
        error: "Image uploaded but failed to save record",
      };
    }
  }
);

export const getImages = withAuthAction(
  async (auth, folderPath?: string) => {
    if (!auth.profile) {
      return { success: false as const, error: "Profile not found." };
    }

    try {
      const images = await getCloudinaryImages(folderPath);
      return {
        success: true as const,
        data: images,
        message: "Images loaded",
      };
    } catch (error) {
      console.error("Error fetching images:", error);
      return { success: false as const, error: "Failed to fetch images" };
    }
  }
);
