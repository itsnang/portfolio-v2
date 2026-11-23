import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { revalidateMessageSchema, type RevalidateResource } from "./revalidate";

export type RevalidatePage = { path: string; type?: "layout" };

/** A Site's pages for each resource the Admin Site can change. */
export type PagesFor = Record<RevalidateResource, (slugs: string[]) => RevalidatePage[]>;

function isAuthorized(header: string | null, secret: string | undefined) {
  if (!secret || !header?.startsWith("Bearer ")) return false;
  // Hashing gives equal-length buffers, so the comparison takes constant time.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.slice("Bearer ".length)), digest(secret));
}

/**
 * The POST handler for a public Site's /api/revalidate. Without the shared
 * bearer secret (or when the Site has none set) it refreshes nothing.
 */
export function createRevalidateRoute({ secret, pagesFor }: { secret: string | undefined; pagesFor: PagesFor }) {
  return async function POST(request: Request) {
    if (!isAuthorized(request.headers.get("authorization"), secret)) {
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
  };
}
