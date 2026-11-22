import "server-only";

import { cache } from "react";

import * as queries from "@portfolio/db/queries";
import { db } from "@/db/drizzle";
import { NotFoundError } from "@/lib/errors";

export const getPublishedBlogPosts = cache(() => queries.getPublishedBlogPosts(db));

export const getBlogPostBySlug = (slug: string) => queries.getBlogPostBySlug(db, slug);

/** Public detail-page read: the post plus its prev/next neighbors for in-order navigation. */
export const getBlogDetail = async (slug: string) => {
  const post = await queries.getBlogDetail(db, slug);
  if (!post) throw new NotFoundError();
  return post;
};
