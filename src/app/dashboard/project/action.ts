"use server";

import { db } from "@/db/drizzle";
import { projecInsertSchema, ProjectInsert } from "@/db/schema/project.schema";
import { TbProject } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/lucia/session";
import { err, ok } from "@justmiracle/result";
import { redirect } from "next/navigation";

export const insertProject = async (project: ProjectInsert) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const validated = projecInsertSchema.safeParse(project);
  if (!validated.success) {
    console.log(validated.error);
    throw new InsertError();
  }

  console.log("insert project body:", project);

  const projectInsert = await db
    .insert(TbProject)
    .values(project)
    .returning()
    .then(ok)
    .catch(err);
  if (projectInsert.error) {
    console.log(projectInsert.error.message);
    throw new InsertError();
  }
};
