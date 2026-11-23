import "server-only";

import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { TbProject } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every project the admin owns, including inactive ones, in display order. */
export async function getProjects() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbProject.findMany({
    where: and(eq(TbProject.profileId, profile.id), isNull(TbProject.deletedAt)),
    orderBy: [asc(TbProject.sortOrder), desc(TbProject.createdAt)],
  });
}
