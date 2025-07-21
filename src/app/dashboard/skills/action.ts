"use server";
import { db } from "@/db/drizzle";
import { SkillsInsert, skillsInsertSchema } from "@/db/schema/skills.schma";
import { TbSkills } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

export const insertSkill = async (skill: SkillsInsert) => {
  const validated = skillsInsertSchema.safeParse(skill);
  if (!validated.success) {
    console.log(validated.error);
    throw new InsertError();
  }
  console.log("insert skill body:", skill);
  const skills = await db
    .insert(TbSkills)
    .values(skill)
    .returning()
    .then(ok)
    .catch(err);

  if (skills.error) {
    console.log(skills.error.message);
    throw new InsertError();
  }
};
