"use server";

import { env } from "@/utils/env";

export const uploadStagedFile = async (
  stagedFile: File | Blob
): Promise<string> => {
  const form = new FormData();
  form.set("file", stagedFile);

  // // here /api/upload is the route of my handler
  const res = await fetch(`${env.BASE_URL_DEV}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  console.log(data.imgUrl);
  return data.imgUrl;
};
