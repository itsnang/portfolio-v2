"use server";

import { db } from "@/db/drizzle";
import { SocialsInsert, socialsInsertSchema } from "@/db/schema/socials.schme";
import { TbSocials } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/lucia/session";
import { err, ok } from "@justmiracle/result";
import { redirect } from "next/navigation";

export const inserSocial = async (soscial: SocialsInsert) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const validated = socialsInsertSchema.safeParse(soscial);
  if (!validated.success) {
    console.log(validated.error);
    throw new InsertError();
  }

  console.log("insert social body:", soscial);

  const socials = await db
    .insert(TbSocials)
    .values(soscial)
    .returning()
    .then(ok)
    .catch(err);
  if (socials.error) {
    console.log(socials.error.message);
    throw new InsertError();
  }
};
