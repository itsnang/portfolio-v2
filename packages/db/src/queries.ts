import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";

import type { DB } from "./client";
import { TbBlogPost } from "./tables";

const DEFAULT_APP_CONFIG = { id: "config", maintenance: false, theme: "modern" as const };

export async function getAppConfig(db: DB) {
  const config = await db.query.TbAppConfig.findFirst();
  return config ?? DEFAULT_APP_CONFIG;
}

export async function getPublishedBlogPosts(db: DB) {
  try {
    return await db.query.TbBlogPost.findMany({
      where: and(
        eq(TbBlogPost.status, "published"),
        isNull(TbBlogPost.deletedAt)
      ),
      orderBy: [desc(TbBlogPost.publishedAt)],
    });
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    throw new Error("Failed to fetch blog posts");
  }
}
