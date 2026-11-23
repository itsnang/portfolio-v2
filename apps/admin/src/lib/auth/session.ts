import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { TbProfile } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { auth } from "./better-auth";

// Server-only reads of the signed-in admin. Deliberately not "use server":
// these must never be callable from the browser.

/** The signed-in user; redirects to /sign-in without a session. Cached per request. */
export const requireAuth = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return session.user;
});

/** The signed-in admin's profile, which owns every content row, or null before one exists. */
export const getOwnProfile = cache(async () => {
  const user = await requireAuth();
  const profile = await db.query.TbProfile.findFirst({ where: eq(TbProfile.userId, user.id) });
  return profile ?? null;
});
