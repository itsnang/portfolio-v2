import { db } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";
import { err, ok } from "@justmiracle/result";

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
