"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { NotFoundError, UploadImagesError } from "@/lib/errors";
import { env } from "@/utils/env";
import { err, ok } from "@justmiracle/result";
import {
  getCloudinaryImages,
  getCloudinaryFolders,
  createCloudinaryFolder,
} from "@/lib/cloudinary";

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
  const form = new FormData();
  form.set("file", stagedFile);
  form.set("folder", folderPath);

  const res = await fetch(`${env.BASE_URL_DEV}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  if (!data.success) {
    throw new UploadImagesError();
  }

  const img: string = data.imgUrl;
  const imageUpload = await db
    .insert(TbImages)
    .values({
      imageUrl: img,
      isActive: true,
    })
    .returning()
    .then(ok)
    .catch(err);

  if (imageUpload.error) {
    throw new UploadImagesError();
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
