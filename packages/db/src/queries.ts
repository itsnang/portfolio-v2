import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";

import type { DB } from "./client";
import { TbBlogPost } from "./tables";

const DEFAULT_APP_CONFIG = { id: "config", maintenance: false, theme: "modern" as const };

export async function getAppConfig(db: DB) {
  const config = await db.query.TbAppConfig.findFirst();
  return config ?? DEFAULT_APP_CONFIG;
}

const isPublished = and(eq(TbBlogPost.status, "published"), isNull(TbBlogPost.deletedAt));

export async function getPublishedBlogPosts(db: DB) {
  try {
    return await db.query.TbBlogPost.findMany({
      where: isPublished,
      orderBy: [desc(TbBlogPost.publishedAt)],
    });
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    throw new Error("Failed to fetch blog posts");
  }
}


/** A published Post, or `undefined` when there's none with that slug. */
export async function getBlogPostBySlug(db: DB, slug: string) {
  return db.query.TbBlogPost.findFirst({
    where: and(eq(TbBlogPost.slug, slug), isPublished),
  });
}

/**
 * A published Post with its position in the list and its neighbours, newest
 * first, or `null` when there's none with that slug.
 */
export async function getBlogDetail(db: DB, slug: string) {
  const post = await getBlogPostBySlug(db, slug);
  if (!post) return null;

  const allPosts = await db.query.TbBlogPost.findMany({
    where: isPublished,
    columns: { id: true, slug: true, title: true },
    orderBy: [desc(TbBlogPost.publishedAt)],
  });

  return { ...post, ...neighbours(allPosts, (p) => p.slug === slug) };
}

/**
 * An item's position in a list and its neighbours, without wrapping around:
 * the first item has no `prev` and the last has no `next`.
 */
export function neighbours<T>(items: T[], isCurrent: (item: T) => boolean) {
  const idx = items.findIndex(isCurrent);
  return {
    number: idx + 1,
    total: items.length,
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null,
  };
}
