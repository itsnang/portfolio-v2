"use server";

import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/drizzle";
import { blogPostInsertSchema, type BlogPostInsert } from "@/db/schema/blog.schema";
import { TbBlogPost } from "@/db/table";
import { slugify } from "@/utils/slugify";
import { withAuthAction } from "@/lib/auth/middleware";
import { NotFoundError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await db.query.TbBlogPost.findFirst({
    where: excludeId
      ? and(
          eq(TbBlogPost.slug, slug),
          ne(TbBlogPost.id, excludeId),
          isNull(TbBlogPost.deletedAt)
        )
      : and(eq(TbBlogPost.slug, slug), isNull(TbBlogPost.deletedAt)),
  });
  if (existing) {
    throw new Error("Slug is already in use. Please choose another one.");
  }
}

export const createBlogPostAction = withAuthAction(
  async (auth, post: BlogPostInsert) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const validated = blogPostInsertSchema.safeParse(post);
      if (!validated.success) {
        throw new Error("Invalid blog post data");
      }

      const slug = slugify(validated.data.slug);
      await assertSlugAvailable(slug);

      const [created] = await db
        .insert(TbBlogPost)
        .values({
          ...validated.data,
          slug,
          coverImage: validated.data.coverImage || null,
          profileId: auth.profile.id,
          publishedAt: validated.data.status === "published" ? new Date() : null,
        })
        .returning();

      revalidatePath("/dashboard/blog");
      revalidatePath("/");
      revalidatePath("/blog");

      return {
        success: true as const,
        data: created,
        message: "Blog post created successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to create blog post" };
    }
  }
);

export const updateBlogPostAction = withAuthAction(
  async (auth, id: string, post: BlogPostInsert) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const validated = blogPostInsertSchema.safeParse(post);
      if (!validated.success) {
        throw new Error("Invalid blog post data");
      }

      const existing = await db.query.TbBlogPost.findFirst({
        where: and(
          eq(TbBlogPost.id, id),
          eq(TbBlogPost.profileId, auth.profile.id),
          isNull(TbBlogPost.deletedAt)
        ),
      });
      if (!existing) {
        throw new Error("Blog post not found");
      }

      const slug = slugify(validated.data.slug);
      await assertSlugAvailable(slug, id);

      // publishedAt is server-computed: set once on first publish, never
      // overwritten by later saves or by unpublishing.
      const publishedAt =
        existing.publishedAt ??
        (validated.data.status === "published" ? new Date() : null);

      // profileId is never client-controlled — a post's owner can't change.
      const { profileId: _ignoredProfileId, ...safeData } = validated.data;

      const [updated] = await db
        .update(TbBlogPost)
        .set({
          ...safeData,
          slug,
          coverImage: safeData.coverImage || null,
          publishedAt,
        })
        .where(
          and(
            eq(TbBlogPost.id, id),
            eq(TbBlogPost.profileId, auth.profile.id)
          )
        )
        .returning();

      revalidatePath("/dashboard/blog");
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      if (existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);

      return {
        success: true as const,
        data: updated,
        message: "Blog post updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to update blog post" };
    }
  }
);

export const deleteBlogPostAction = withAuthAction(async (auth, id: string) => {
  try {
    if (!auth.profile) {
      throw new Error("Profile not found.");
    }

    const existing = await db.query.TbBlogPost.findFirst({
      where: and(
        eq(TbBlogPost.id, id),
        eq(TbBlogPost.profileId, auth.profile.id),
        isNull(TbBlogPost.deletedAt)
      ),
    });
    if (!existing) {
      throw new Error("Blog post not found");
    }

    await db
      .update(TbBlogPost)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(TbBlogPost.id, id), eq(TbBlogPost.profileId, auth.profile.id))
      );

    revalidatePath("/dashboard/blog");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);

    return { success: true as const, message: "Blog post deleted" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Failed to delete blog post" };
  }
});

export const getBlogPosts = withAuthAction(async (auth) => {
  if (!auth.profile) return [];
  return db.query.TbBlogPost.findMany({
    where: and(
      eq(TbBlogPost.profileId, auth.profile.id),
      isNull(TbBlogPost.deletedAt)
    ),
    orderBy: [desc(TbBlogPost.createdAt)],
  });
});

export const getBlogPostById = withAuthAction(async (auth, id: string) => {
  if (!auth.profile) return undefined;
  return db.query.TbBlogPost.findFirst({
    where: and(
      eq(TbBlogPost.id, id),
      eq(TbBlogPost.profileId, auth.profile.id),
      isNull(TbBlogPost.deletedAt)
    ),
  });
});

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
  const prev = total > 1 ? allPosts[(idx - 1 + total) % total] : null;
  const next = total > 1 ? allPosts[(idx + 1) % total] : null;

  return {
    ...post.value,
    number: idx + 1,
    total,
    prev,
    next,
  };
};
