import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { revalidateMessageSchema, type RevalidateResource } from "@portfolio/db/schema";

import { env } from "@/utils/env";

type Page = { path: string; type?: "layout" };

// The Blog Site's pages for each resource the Admin Site can change. Resources
// that only appear on the Main Site refresh nothing here.
const pagesFor: Record<RevalidateResource, (slugs: string[]) => Page[]> = {
  // An edited slug arrives as both the old and new values, so both pages refresh.
  post: (slugs) => [
    { path: "/" },
    { path: "/sitemap.xml" },
    ...slugs.map((slug) => ({ path: `/${slug}` })),
  ],
  // Theme and maintenance mode affect every page.
  "app-config": () => [{ path: "/", type: "layout" }],
  project: () => [],
  socials: () => [],
  profile: () => [],
};

// Same check as the Main Site's endpoint.
function isAuthorized(header: string | null) {
  if (!header?.startsWith("Bearer ")) return false;
  // Hashing gives equal-length buffers, so the comparison takes constant time.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.slice("Bearer ".length)), digest(env.REVALIDATE_SECRET));
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
