import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { err, ok } from "@justmiracle/result";

import { db } from "@/db/drizzle";
import { TbBlogPost } from "@/db/table";
import { NotFoundError } from "@/lib/errors";

export const getPublishedBlogPosts = async () => {
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
};

export const getBlogPostBySlug = async (slug: string) => {
  try {
    return await db.query.TbBlogPost.findFirst({
      where: and(
        eq(TbBlogPost.slug, slug),
        eq(TbBlogPost.status, "published"),
        isNull(TbBlogPost.deletedAt)
      ),
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw new Error("Failed to fetch blog post");
  }
};

/** Public detail-page read: the post plus its prev/next neighbors for in-order navigation. */
export const getBlogDetail = async (slug: string) => {
  const post = await db.query.TbBlogPost.findFirst({
    where: (p, { eq, and, isNull }) =>
      and(eq(p.slug, slug), eq(p.status, "published"), isNull(p.deletedAt)),
  })
    .then((p) => {
      if (!p) throw new NotFoundError();
      return p;
    })
    .then(ok)
    .catch(err);

  if (post.error) throw new NotFoundError();

  const allPosts = await db.query.TbBlogPost.findMany({
    where: (p, { eq, and, isNull }) =>
      and(eq(p.status, "published"), isNull(p.deletedAt)),
    columns: { id: true, slug: true, title: true },
    orderBy: (p, { desc }) => [desc(p.publishedAt)],
  });

  const idx = allPosts.findIndex((p) => p.slug === slug);
  const total = allPosts.length;
  // Linear (non-circular) pagination — wrapping around with modulo made prev
  // and next collide on the same post whenever there were exactly 2 posts.
  const prev = idx > 0 ? allPosts[idx - 1] : null;
  const next = idx >= 0 && idx < total - 1 ? allPosts[idx + 1] : null;

  return {
    ...post.value,
    number: idx + 1,
    total,
    prev,
    next,
  };
};
