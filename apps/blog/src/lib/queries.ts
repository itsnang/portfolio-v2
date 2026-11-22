import "server-only";

import { cache } from "react";
import * as queries from "@portfolio/db/queries";
import { db } from "@/db/drizzle";

// Every read here only needs SELECT, so the Site can connect as portfolio_public.

export const getAppConfig = cache(() => queries.getAppConfig(db));

export const getPublishedBlogPosts = cache(() => queries.getPublishedBlogPosts(db));

export const getBlogPostBySlug = cache((slug: string) => queries.getBlogPostBySlug(db, slug));

/** The Post with its neighbours, or `null` when there's no published Post with that slug. */
export const getBlogDetail = cache((slug: string) => queries.getBlogDetail(db, slug));
