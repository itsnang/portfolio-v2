import "server-only";

import { and, asc, eq, isNull } from "drizzle-orm";
import { TbExperiences } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/**
 * Every experience the admin owns, including inactive ones (the table shows
 * them with an "Inactive" badge), in display order.
 */
export async function getExperiences() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbExperiences.findMany({
    where: and(eq(TbExperiences.userId, profile.id), isNull(TbExperiences.deletedAt)),
    orderBy: [asc(TbExperiences.sortOrder)],
  });
}
