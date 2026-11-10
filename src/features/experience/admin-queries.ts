import "server-only";

import { db } from "@/db/drizzle";
import { requireAuth } from "@/lib/auth/get-current-user";

export const getExperiences = async () => {
  await requireAuth();
  try {
    const experiences = await db.query.TbExperiences.findMany({
      where: (experience, { eq }) => eq(experience.isActive, true),
    });
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
};
