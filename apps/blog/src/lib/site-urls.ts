import "server-only";

import { env } from "@/utils/env";

/** The Main Site's home page, for the link home. */
export const mainUrl = env.NEXT_PUBLIC_MAIN_URL;

/** This Site's own address, for metadata. */
export const blogUrl = env.NEXT_PUBLIC_BLOG_URL;
