import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { TbRecommendations } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every recommendation the admin owns, including inactive ones, newest first. */
export async function getRecommendations() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbRecommendations.findMany({
    where: and(eq(TbRecommendations.profileId, profile.id), isNull(TbRecommendations.deletedAt)),
    orderBy: [desc(TbRecommendations.createdAt)],
  });
}
