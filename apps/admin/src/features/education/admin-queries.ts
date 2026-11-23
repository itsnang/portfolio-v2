import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { TbEducation } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every education entry the admin owns, including inactive ones, latest first. */
export async function getEducations() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbEducation.findMany({
    where: and(eq(TbEducation.userId, profile.id), isNull(TbEducation.deletedAt)),
    orderBy: [desc(TbEducation.startDate)],
  });
}
