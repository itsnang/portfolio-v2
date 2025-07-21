"use server";
import { db } from "@/db/drizzle";
import { ProfileInsert } from "@/db/schema/profile.schema";
import { TbProfile } from "@/db/table";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { InsertError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";
import { eq } from "drizzle-orm";

export const updateProfileAction = async (profie: ProfileInsert) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  const userId = user?.id;
  const insertProfile = await db
    .update(TbProfile)
    .set(profie)
    .where(eq(TbProfile.id, userId))
    .returning()
    .then(ok)
    .catch(err);

  if (insertProfile.error) {
    console.log(insertProfile.error.message);
    throw new InsertError();
  }
};
