import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { revalidateMessageSchema, type RevalidateResource } from "@portfolio/db/schema";

import { env } from "@/utils/env";

type Page = { path: string; type?: "layout" };

// The Main Site's pages for each resource the Admin Site can change.
const pagesFor: Record<RevalidateResource, (slugs: string[]) => Page[]> = {
  // Remove "/blog" and the Post pages in the PR that removes /blog from the Main Site.
  post: (slugs) => [{ path: "/" }, { path: "/blog" }, ...slugs.map((slug) => ({ path: `/blog/${slug}` }))],
  project: (ids) => [{ path: "/" }, ...ids.map((id) => ({ path: `/projects/${id}` }))],
  // Theme and maintenance mode affect every page.
  "app-config": () => [{ path: "/", type: "layout" }],
  socials: () => [{ path: "/" }, { path: "/achievement" }],
  profile: () => [{ path: "/" }],
};

function isAuthorized(header: string | null) {
  const secret = env.REVALIDATE_SECRET;
  if (!secret || !header?.startsWith("Bearer ")) return false;
  // Hashing gives equal-length buffers, so the comparison takes constant time.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.slice("Bearer ".length)), digest(secret));
}

export async function POST(request: Request) {
  if (!isAuthorized(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = revalidateMessageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }

  const { resource, slugs } = parsed.data;
  const pages = pagesFor[resource](slugs);
  for (const { path, type } of pages) revalidatePath(path, type);
  return Response.json({ revalidated: pages });
}
