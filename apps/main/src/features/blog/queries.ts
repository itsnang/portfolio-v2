import "server-only";

import { cache } from "react";
import * as queries from "@portfolio/db/queries";
import { db } from "@/db/drizzle";

// The home page's "From the Blog" teaser. Post pages live on the Blog Site.
export const getPublishedBlogPosts = cache(() => queries.getPublishedBlogPosts(db));
