import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { TbBlogPost } from "@portfolio/db/schema";
import { db } from "@/db/drizzle";
import { getOwnProfile } from "@/lib/auth/session";

/** Every Post the admin owns, drafts included, newest first. */
export async function getBlogPosts() {
  const profile = await getOwnProfile();
  if (!profile) return [];
  return db.query.TbBlogPost.findMany({
    where: and(eq(TbBlogPost.profileId, profile.id), isNull(TbBlogPost.deletedAt)),
    orderBy: [desc(TbBlogPost.createdAt)],
  });
}
