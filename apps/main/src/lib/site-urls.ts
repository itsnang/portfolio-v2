import "server-only";

import { env } from "@/utils/env";

/** This Site's own address, for canonical, sitemap and metadata URLs. */
export const mainUrl = env.NEXT_PUBLIC_MAIN_URL;

/** The Blog Site, which owns the Post list and every Post. */
export const blogUrl = env.NEXT_PUBLIC_BLOG_URL;

/** A page on this Site, as an absolute URL. */
export const mainPageUrl = (path = "/") => new URL(path, mainUrl).toString();
