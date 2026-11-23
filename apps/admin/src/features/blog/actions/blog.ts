"use server";

import { and, eq, isNull, ne } from "drizzle-orm";
import { blogPostInsertSchema, type BlogPostInsert, TbBlogPost } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";
import { slugify } from "@/utils/slugify";

const dashboardPath = "/dashboard/blog";

const ownPost = (id: string, profileId: string) =>
  and(eq(TbBlogPost.id, id), eq(TbBlogPost.profileId, profileId), isNull(TbBlogPost.deletedAt));

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await db.query.TbBlogPost.findFirst({
    where: and(
      eq(TbBlogPost.slug, slug),
      isNull(TbBlogPost.deletedAt),
      excludeId ? ne(TbBlogPost.id, excludeId) : undefined
    ),
  });
  if (existing) throw new ActionError("Slug is already in use. Please choose another one.");
}

/** The parsed Post with a normalised slug and no client-controlled owner or publish date. */
function parsePost(post: BlogPostInsert) {
  const { profileId: _owner, publishedAt: _published, ...values } = parseInput(
    blogPostInsertSchema,
    post,
    "Invalid blog post data"
  );
  return { ...values, slug: slugify(values.slug), coverImage: values.coverImage || null };
}

export const createBlogPostAction = adminAction(
  "Failed to create blog post",
  async ({ profile }, post: BlogPostInsert) => {
    const values = parsePost(post);
    await assertSlugAvailable(values.slug);

    const [created] = await db
      .insert(TbBlogPost)
      .values({
        ...values,
        profileId: profile.id,
        publishedAt: values.status === "published" ? new Date() : null,
      })
      .returning();

    return {
      data: created,
      message: "Blog post created successfully",
      dashboardPath,
      refresh: { resource: "post", slugs: [values.slug] },
    };
  }
);

export const updateBlogPostAction = adminAction(
  "Failed to update blog post",
  async ({ profile }, id: string, post: BlogPostInsert) => {
    const values = parsePost(post);
    const existing = await db.query.TbBlogPost.findFirst({ where: ownPost(id, profile.id) });
    if (!existing) throw new ActionError("Blog post not found");
    await assertSlugAvailable(values.slug, id);

    const [updated] = await db
      .update(TbBlogPost)
      .set({
        ...values,
        // Set once on first publish; later saves and unpublishing never change it.
        publishedAt: existing.publishedAt ?? (values.status === "published" ? new Date() : null),
      })
      .where(ownPost(id, profile.id))
      .returning();

    return {
      data: updated,
      message: "Blog post updated successfully",
      dashboardPath,
      // A changed slug refreshes both the old and the new Post page.
      refresh: {
        resource: "post",
        slugs: existing.slug === values.slug ? [values.slug] : [values.slug, existing.slug],
      },
    };
  }
);

export const deleteBlogPostAction = adminAction(
  "Failed to delete blog post",
  async ({ profile }, id: string) => {
    const [deleted] = await db
      .update(TbBlogPost)
      .set({ deletedAt: new Date() })
      .where(ownPost(id, profile.id))
      .returning({ slug: TbBlogPost.slug });
    if (!deleted) throw new ActionError("Blog post not found");

    return {
      data: undefined,
      message: "Blog post deleted",
      dashboardPath,
      refresh: { resource: "post", slugs: [deleted.slug] },
    };
  }
);
