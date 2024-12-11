"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { UploadImagesError } from "@/lib/errors";
import { env } from "@/utils/env";
import { err, ok } from "@justmiracle/result";

export const uploadStagedFile = async (stagedFile: File | Blob) => {
  const form = new FormData();
  form.set("file", stagedFile);

  const res = await fetch(`${env.BASE_URL_DEV}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  const img: string = data.imgUrl;
  const imageUpload = await db
    .insert(TbImages)
    .values({
      imageUrl: img,
    })
    .returning()
    .then(ok)
    .catch(err);

  if (imageUpload.error) {
    throw new UploadImagesError();
  }
};
