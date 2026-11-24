import "server-only";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import type { RevalidateMessage, TbProfile } from "@portfolio/db/schema";

import { getOwnProfile, requireAuth } from "@/lib/auth/session";
import { refreshPublicSites } from "@/lib/refresh-public-sites";

/** What every Admin Site action returns. Forms branch on `success`. */
export type ActionResult<T = undefined> =
  | { success: true; data: T; message: string; warning?: string }
  | { success: false; error: string };

/** An error whose message is safe to show the admin. Any other error shows the action's fallback. */
export class ActionError extends Error {}

/** What an action body returns once its write has succeeded. */
export interface Saved<T> {
  data: T;
  message: string;
  /** The Admin Site page that lists what changed. */
  dashboardPath?: string;
  /** What changed, so the public Sites refresh those pages. Omit when nothing public changed. */
  refresh?: RevalidateMessage;
}

export interface AdminContext {
  /** The signed-in admin's profile, which owns every content row. */
  profile: typeof TbProfile.$inferSelect;
}

/**
 * Wraps an Admin Site action: requires a session (redirecting to /sign-in like
 * pages do) and the admin's profile, runs the write, refreshes the dashboard
 * page and the public Sites, and turns every outcome into an ActionResult. A
 * failed refresh comes back as `warning`; the save still stands.
 */
export function adminAction<Args extends unknown[], T>(
  fallbackError: string,
  run: (ctx: AdminContext, ...args: Args) => Promise<Saved<T>>
): (...args: Args) => Promise<ActionResult<T>> {
  return async (...args) => {
    // Outside the try: an expired session redirects, and that redirect must not be caught.
    await requireAuth();
    const profile = await getOwnProfile();
    if (!profile) return { success: false, error: "Create your profile first." };

    let saved: Saved<T>;
    try {
      saved = await run({ profile }, ...args);
    } catch (error) {
      if (error instanceof ActionError) return { success: false, error: error.message };
      console.error(`${fallbackError}:`, error);
      return { success: false, error: fallbackError };
    }

    if (saved.dashboardPath) revalidatePath(saved.dashboardPath);
    const warning = saved.refresh ? await refreshPublicSites(saved.refresh) : undefined;
    return { success: true, data: saved.data, message: saved.message, warning };
  };
}

/** Validates input with a schema and returns the parsed value, which is what gets written. */
export function parseInput<S extends z.ZodTypeAny>(schema: S, input: unknown, message: string): z.output<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new ActionError(message);
  return parsed.data;
}
