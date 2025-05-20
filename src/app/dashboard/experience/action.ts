"use server";

import { db } from "@/db/drizzle";
import { ExperiencesInsert } from "@/db/schema/experiences.schema";
import { TbExperiences } from "@/db/table";
import { InsertError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/lucia/session";
import { err, ok } from "@justmiracle/result";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

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

export const getExperiences = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const experiences = await db.query.TbExperiences.findMany({
      where: (experience, { eq }) => eq(experience.userId, user.id),
    });
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
};

export const getExperienceById = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const experience = await db.query.TbExperiences.findFirst({
      where: (experience, { eq }) => eq(experience.id, id),
    });
    return experience;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw new Error("Failed to fetch experience");
  }
};

export const updateExperience = async (
  id: string,
  experience: ExperiencesInsert
) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const updatedExperience = await db
      .update(TbExperiences)
      .set({
        ...experience,
        updatedAt: new Date(),
      })
      .where(and(eq(TbExperiences.id, id), eq(TbExperiences.userId, user.id)))
      .returning()
      .then(ok)
      .catch(err);

    if (updatedExperience.error) {
      console.log(updatedExperience.error.message);
      throw new Error("Failed to update experience");
    }

    return updatedExperience.value[0];
  } catch (error) {
    console.error("Error updating experience:", error);
    throw new Error("Failed to update experience");
  }
};
