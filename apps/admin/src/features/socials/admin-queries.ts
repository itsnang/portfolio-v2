import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { TbSocials } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every social link the admin owns, including inactive ones, newest first. */
export async function getSocials() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbSocials.findMany({
    where: and(eq(TbSocials.userId, profile.id), isNull(TbSocials.deletedAt)),
    orderBy: [desc(TbSocials.createdAt)],
  });
}
