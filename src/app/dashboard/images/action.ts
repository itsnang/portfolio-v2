"use server";

import { db } from "@/db/drizzle";
import { TbImages } from "@/db/table";
import { env } from "@/utils/env";

export const uploadStagedFile = async (
  stagedFile: File | Blob
): Promise<string> => {
  const form = new FormData();
  form.set("file", stagedFile);

  const res = await fetch(`${env.BASE_URL_DEV}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  const img: string = data.imgUrl;
  const imageUrl = await db.insert(TbImages).values({
    imageUrl: img,
  });

  console.log(data.imgUrl);
  return data.imgUrl;
};
