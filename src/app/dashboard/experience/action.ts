"use server";

import { db } from "@/db/drizzle";
import { ExperiencesInsert } from "@/db/schema/experiences.schema";
import { TbExperiences } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/lucia/session";
import { err, ok } from "@justmiracle/result";
import { redirect } from "next/navigation";

export const insertExperiences = async (experience: ExperiencesInsert) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  console.log("insert skill body:", experience);

  const insertExperience = await db
    .insert(TbExperiences)
    .values(experience)
    .returning()
    .then(ok)
    .catch(err);
  if (insertExperience.error) {
    console.log(insertExperience.error.message);
    throw new InsertError();
  }
};
