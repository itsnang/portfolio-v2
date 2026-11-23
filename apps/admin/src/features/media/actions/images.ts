"use server";

import { TbImages } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction } from "@/lib/admin-action";
import { createCloudinaryFolder } from "@/lib/cloudinary";
import { uploadToCloudinaryFolder } from "@/features/media/utils/upload";
import { fileTooLargeMessage } from "@/features/media/constants";

// Reads go through GET /api/images and /api/image-folders (see hooks/use-images.ts).

export const createFolder = adminAction("Failed to create folder", async (_ctx, folderName: string) => {
  await createCloudinaryFolder(folderName);
  return { data: { name: folderName }, message: "Folder created successfully" };
});

export const uploadStagedFile = adminAction(
  "Upload to Cloudinary failed",
  async (_ctx, stagedFile: File | Blob, folderPath: string) => {
    const tooLarge = fileTooLargeMessage(stagedFile.size);
    if (tooLarge) throw new ActionError(tooLarge);

    const fileName = stagedFile instanceof File ? stagedFile.name : "upload";
    const base64Data = Buffer.from(await stagedFile.arrayBuffer()).toString("base64");
    const fileUri = `data:${stagedFile.type};base64,${base64Data}`;

    let imageUrl: string;
    try {
      ({ imageUrl } = await uploadToCloudinaryFolder(fileUri, fileName, folderPath));
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // Cloudinary's SDK rejects with a plain { message, name, http_code } object, not an Error.
      const message = error && typeof error === "object" && "message" in error ? String(error.message) : null;
      throw new ActionError(message ?? "Upload to Cloudinary failed");
    }

    const [created] = await db
      .insert(TbImages)
      .values({ imageUrl, isActive: true })
      .returning({ id: TbImages.id, imageUrl: TbImages.imageUrl });
    return { data: created, message: "Image uploaded" };
  }
);
