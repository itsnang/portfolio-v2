"use server";

import { db } from "@/db/drizzle";
import { EducationInsert } from "@/db/schema/education.schema";
import { TbEducation } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

export const insertEducation = async (education: EducationInsert) => {
  const insertEducation = await db
    .insert(TbEducation)
    .values(education)
    .returning()
    .then(ok)
    .catch(err);
  if (insertEducation.error) {
    console.log(insertEducation.error.message);
    throw new InsertError();
  }
};
