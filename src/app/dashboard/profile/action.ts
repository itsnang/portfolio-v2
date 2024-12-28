"use server";
import { db } from "@/db/drizzle";
import { ProfileInsert } from "@/db/schema/profile.schema";
import { TbProfile } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const updateProfileAction = async (profie: ProfileInsert) => {
  const insertProfile = await db
    .update(TbProfile)
    .set(profie)
    .where(eq(TbProfile.id, "1"))
    .returning()
    .then(ok)
    .catch(err);

  revalidateTag("profile");
  if (insertProfile.error) {
    console.log(insertProfile.error.message);
    throw new InsertError();
  }
};
