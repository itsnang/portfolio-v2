"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { NotFoundError, UploadImagesError } from "@/lib/errors";
import { env } from "@/utils/env";
import { err, ok } from "@justmiracle/result";

export const uploadStagedFile = async (stagedFile: File | Blob) => {
  const form = new FormData();
  form.set("file", stagedFile);

  const res = await fetch(`${env.BASE_URL_DEV}/api/upload`, {
    method: "POST",
    body: form,
  });

  console.log("=========>", res);

  const data = await res.json();

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

  console.log("======>", imageUpload);

  if (imageUpload.error) {
    throw new UploadImagesError();
  }
};

export const getImages = async () => {
  const images = await db.query.TbImages.findMany({
    where: (image, { eq }) => eq(image.isActive, true),
    columns: {
      id: true,
      imageUrl: true,
    },
  })
    .then(ok)
    .catch(err);
  if (images.error) {
    throw new NotFoundError();
  }
  return images.value;
};
