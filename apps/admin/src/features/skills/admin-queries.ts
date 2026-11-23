import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { TbSkills } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every skill the admin owns, including inactive ones, newest first. */
export async function getSkills() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbSkills.findMany({
    where: and(eq(TbSkills.userId, profile.id), isNull(TbSkills.deletedAt)),
    orderBy: [desc(TbSkills.createdAt)],
  });
}
